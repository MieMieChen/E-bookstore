#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
医疗流程数据转换为 XES 格式
用于 ProM 流程挖掘
"""

import pandas as pd
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom
import os


def clean_medical_data(df):
    """
    数据清洗函数
    """
    print("=" * 60)
    print("开始数据清洗...")
    print(f"原始数据行数: {len(df)}")
    
    # 1. 删除缺失关键字段的行
    required_columns = ['挂号ID', '活动名称', '开始时间']
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        raise ValueError(f"缺少必需的列: {missing_cols}")
    
    # 删除关键字段为空的行
    df_cleaned = df.dropna(subset=['挂号ID', '活动名称', '开始时间']).copy()
    print(f"删除关键字段缺失后: {len(df_cleaned)} 行")
    
    # 2. 确保挂号ID是字符串类型
    df_cleaned['挂号ID'] = df_cleaned['挂号ID'].astype(str)
    
    # 3. 转换时间格式
    try:
        df_cleaned['开始时间'] = pd.to_datetime(df_cleaned['开始时间'])
        if '结束时间' in df_cleaned.columns:
            df_cleaned['结束时间'] = pd.to_datetime(df_cleaned['结束时间'], errors='coerce')
    except Exception as e:
        print(f"时间转换警告: {e}")
        # 尝试多种时间格式
        for fmt in ['%Y-%m-%d %H:%M:%S', '%Y/%m/%d %H:%M:%S', 'ISO8601']:
            try:
                df_cleaned['开始时间'] = pd.to_datetime(df_cleaned['开始时间'], format=fmt if fmt != 'ISO8601' else None)
                break
            except:
                continue
    
    # 4. 删除活动名称为空或无效的行
    df_cleaned = df_cleaned[df_cleaned['活动名称'].str.strip() != '']
    print(f"删除无效活动名称后: {len(df_cleaned)} 行")
    
    # 5. 按挂号ID和时间排序
    df_cleaned = df_cleaned.sort_values(['挂号ID', '开始时间'])
    
    # 6. 统计每个案例的事件数
    case_counts = df_cleaned.groupby('挂号ID').size()
    print(f"\n案例统计:")
    print(f"  总案例数: {len(case_counts)}")
    print(f"  平均每案例事件数: {case_counts.mean():.2f}")
    print(f"  最少事件数: {case_counts.min()}")
    print(f"  最多事件数: {case_counts.max()}")
    
    # 7. 可选：删除事件数过少的案例（可能是不完整的案例）
    min_events = 2  # 至少要有2个事件才算有效案例
    valid_cases = case_counts[case_counts >= min_events].index
    df_cleaned = df_cleaned[df_cleaned['挂号ID'].isin(valid_cases)]
    print(f"\n删除事件数少于{min_events}的案例后: {len(df_cleaned)} 行, {len(valid_cases)} 个案例")
    
    # 8. 检查是否有重复事件
    duplicates = df_cleaned.duplicated(subset=['挂号ID', '活动名称', '开始时间'], keep=False)
    if duplicates.any():
        print(f"\n警告: 发现 {duplicates.sum()} 个重复事件")
        print("重复事件示例:")
        print(df_cleaned[duplicates].head())
        # 删除完全重复的行
        df_cleaned = df_cleaned.drop_duplicates(subset=['挂号ID', '活动名称', '开始时间'])
        print(f"删除重复后: {len(df_cleaned)} 行")
    
    # 9. 显示活动分布
    print("\n活动分布:")
    activity_counts = df_cleaned['活动名称'].value_counts()
    for activity, count in activity_counts.items():
        print(f"  {activity}: {count}")
    
    # 10. 显示清洗后的数据样例
    print("\n清洗后数据样例:")
    print(df_cleaned.head(10))
    
    print("=" * 60)
    return df_cleaned


def convert_to_xes(df, output_file='medical_process.xes'):
    """
    将 DataFrame 转换为 XES 格式
    
    参数:
        df: DataFrame，必须包含以下列:
            - 挂号ID: 作为 case ID
            - 活动名称: 作为 activity name
            - 开始时间: 作为 timestamp
            - 结束时间 (可选): 作为 activity end time
            - 角色 (可选): 作为 org:role
            - 人员ID (可选): 作为 org:resource
            - 持续时间 (可选): 作为 duration
        output_file: 输出文件路径
    """
    
    # 数据清洗
    df = clean_medical_data(df)
    
    # 创建 XES 根元素
    log = ET.Element('log')
    log.set('xes.version', '1.0')
    log.set('xes.features', 'nested-attributes')
    log.set('openxes.version', '1.0RC7')
    
    # 添加扩展声明
    extensions = [
        ('Concept', 'concept', 'http://www.xes-standard.org/concept.xesext'),
        ('Time', 'time', 'http://www.xes-standard.org/time.xesext'),
        ('Organizational', 'org', 'http://www.xes-standard.org/org.xesext'),
        ('Lifecycle', 'lifecycle', 'http://www.xes-standard.org/lifecycle.xesext'),
    ]
    
    for name, prefix, uri in extensions:
        ext = ET.SubElement(log, 'extension')
        ext.set('name', name)
        ext.set('prefix', prefix)
        ext.set('uri', uri)
    
    # 添加全局属性
    for scope in ['trace', 'event']:
        global_scope = ET.SubElement(log, 'global', scope=scope)
        
        if scope == 'trace':
            string_attr = ET.SubElement(global_scope, 'string')
            string_attr.set('key', 'concept:name')
            string_attr.set('value', '__INVALID__')
        else:  # event
            string_attr = ET.SubElement(global_scope, 'string')
            string_attr.set('key', 'concept:name')
            string_attr.set('value', '__INVALID__')
            
            date_attr = ET.SubElement(global_scope, 'date')
            date_attr.set('key', 'time:timestamp')
            date_attr.set('value', '1970-01-01T00:00:00.000+00:00')
    
    # 添加分类器
    classifier = ET.SubElement(log, 'classifier')
    classifier.set('name', 'Activity classifier')
    classifier.set('keys', 'concept:name')
    
    # 按挂号ID分组
    grouped = df.groupby('挂号ID')
    
    print(f"\n开始转换 {len(grouped)} 个案例...")
    
    for case_id, case_events in grouped:
        # 创建 trace (案例)
        trace = ET.SubElement(log, 'trace')
        
        # 添加 case ID
        case_name = ET.SubElement(trace, 'string')
        case_name.set('key', 'concept:name')
        case_name.set('value', str(case_id))
        
        # 按时间排序事件
        case_events = case_events.sort_values('开始时间')
        
        # 添加每个事件
        for idx, row in case_events.iterrows():
            event = ET.SubElement(trace, 'event')
            
            # 活动名称
            activity = ET.SubElement(event, 'string')
            activity.set('key', 'concept:name')
            activity.set('value', str(row['活动名称']))
            
            # 开始时间
            timestamp = ET.SubElement(event, 'date')
            timestamp.set('key', 'time:timestamp')
            # 转换为 ISO 8601 格式
            time_str = row['开始时间'].strftime('%Y-%m-%dT%H:%M:%S.000+08:00')
            timestamp.set('value', time_str)
            
            # 结束时间（如果有）
            if '结束时间' in row and pd.notna(row['结束时间']):
                end_time = ET.SubElement(event, 'date')
                end_time.set('key', 'ACTIVITY_END')
                end_time_str = row['结束时间'].strftime('%Y-%m-%dT%H:%M:%S.000+08:00')
                end_time.set('value', end_time_str)
            
            # 持续时间（如果有）
            if '持续时间' in row and pd.notna(row['持续时间']):
                duration = ET.SubElement(event, 'int')
                duration.set('key', 'DURATION')
                duration.set('value', str(int(row['持续时间'])))
            
            # 角色（如果有）
            if '角色' in row and pd.notna(row['角色']):
                role = ET.SubElement(event, 'string')
                role.set('key', 'org:role')
                role.set('value', str(row['角色']))
            
            # 资源/人员（如果有）
            if '人员ID' in row and pd.notna(row['人员ID']):
                resource = ET.SubElement(event, 'string')
                resource.set('key', 'org:resource')
                resource.set('value', str(row['人员ID']))
            
            # 用户ID（如果有且不同于挂号ID）
            if '用户ID' in row and pd.notna(row['用户ID']):
                user_id = ET.SubElement(event, 'string')
                user_id.set('key', 'USER_ID')
                user_id.set('value', str(row['用户ID']))
    
    # 美化 XML
    xml_str = minidom.parseString(ET.tostring(log, encoding='utf-8')).toprettyxml(indent='  ')
    
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"\n✓ XES 文件已生成: {output_file}")
    print(f"  案例数: {len(grouped)}")
    print(f"  事件数: {len(df)}")
    
    return output_file


def analyze_data_quality(df):
    """
    分析数据质量
    """
    print("\n" + "=" * 60)
    print("数据质量分析")
    print("=" * 60)
    
    # 检查必需字段
    required = ['挂号ID', '活动名称', '开始时间']
    for col in required:
        if col in df.columns:
            missing = df[col].isna().sum()
            print(f"✓ {col}: {len(df) - missing}/{len(df)} 有效 ({missing} 缺失)")
        else:
            print(f"✗ {col}: 列不存在")
    
    # 检查可选字段
    optional = ['结束时间', '持续时间', '角色', '人员ID', '用户ID']
    for col in optional:
        if col in df.columns:
            valid = df[col].notna().sum()
            print(f"  {col}: {valid}/{len(df)} 有效")
    
    # 时间范围
    if '开始时间' in df.columns:
        try:
            time_col = pd.to_datetime(df['开始时间'])
            print(f"\n时间范围:")
            print(f"  最早: {time_col.min()}")
            print(f"  最晚: {time_col.max()}")
            print(f"  跨度: {(time_col.max() - time_col.min()).days} 天")
        except:
            pass
    
    print("=" * 60)


# 示例使用
if __name__ == '__main__':
    # 读取数据（支持多种格式）
    input_file = 'medical_data.xlsx'  # 或 .csv, .xls
    
    if not os.path.exists(input_file):
        print(f"错误: 找不到输入文件 '{input_file}'")
        print("\n请确保数据文件存在，并且包含以下列:")
        print("  必需: 挂号ID, 活动名称, 开始时间")
        print("  可选: 结束时间, 持续时间, 角色, 人员ID, 用户ID")
        print("\n数据示例:")
        sample_data = {
            '挂号ID': ['2400', '2400', '2400', '2401', '2401'],
            '活动名称': ['挂号', '检查', '报告审核', '挂号', '检查'],
            '开始时间': ['2023-05-14 10:00:00', '2023-05-14 10:30:00', 
                       '2023-05-14 14:14:07', '2023-05-14 11:00:00', 
                       '2023-05-14 11:30:00'],
            '结束时间': ['2023-05-14 10:05:00', '2023-05-14 10:50:00', 
                       '2023-05-14 14:18:03', '2023-05-14 11:05:00', 
                       '2023-05-14 11:50:00'],
            '角色': ['挂号员', '检查科医生', '检查检验科医生', '挂号员', '检查科医生'],
            '人员ID': ['挂号员_P01', '检查科医生_P10', '检查检验科医生_P22', 
                     '挂号员_P02', '检查科医生_P11']
        }
        sample_df = pd.DataFrame(sample_data)
        sample_df.to_excel('medical_data_template.xlsx', index=False)
        print("\n已创建模板文件: medical_data_template.xlsx")
        exit(1)
    
    # 读取数据
    print(f"读取文件: {input_file}")
    if input_file.endswith('.csv'):
        df = pd.read_csv(input_file, encoding='utf-8-sig')
    else:
        df = pd.read_excel(input_file)
    
    print(f"读取到 {len(df)} 行数据")
    print(f"列名: {list(df.columns)}")
    
    # 数据质量分析
    analyze_data_quality(df)
    
    # 转换为 XES
    output_file = 'medical_process.xes'
    convert_to_xes(df, output_file)
    
    print("\n" + "=" * 60)
    print("转换完成！")
    print("=" * 60)
    print(f"\n下一步:")
    print(f"1. 打开 ProM")
    print(f"2. Import → {output_file}")
    print(f"3. 使用 Inductive Miner 或 Alpha Miner 进行流程挖掘")
    print(f"4. 可视化流程模型")




