#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据清洗示例脚本
展示常见的数据清洗操作
"""

import pandas as pd
import numpy as np


def clean_medical_data_advanced(df):
    """
    高级数据清洗
    """
    print("=" * 80)
    print("高级数据清洗")
    print("=" * 80)
    
    df_original = df.copy()
    print(f"\n原始数据: {len(df)} 行")
    
    # ========== 1. 列名标准化 ==========
    print("\n1. 列名标准化")
    
    # 自动映射常见列名变体
    column_mapping = {
        # 挂号ID的各种变体
        '挂号id': '挂号ID',
        '挂号编号': '挂号ID',
        '就诊ID': '挂号ID',
        '就诊编号': '挂号ID',
        'registration_id': '挂号ID',
        'visit_id': '挂号ID',
        'case_id': '挂号ID',
        'CASE_ID': '挂号ID',
        
        # 活动名称的各种变体
        '活动': '活动名称',
        '事件': '活动名称',
        '事件名称': '活动名称',
        'activity': '活动名称',
        'event': '活动名称',
        'concept:name': '活动名称',
        
        # 时间字段的各种变体
        '时间': '开始时间',
        '时间戳': '开始时间',
        'timestamp': '开始时间',
        'time:timestamp': '开始时间',
        'start_time': '开始时间',
        'START_TIME': '开始时间',
        
        'end_time': '结束时间',
        'END_TIME': '结束时间',
        'ACTIVITY_END': '结束时间',
        
        # 其他字段
        'duration': '持续时间',
        'DURATION': '持续时间',
        'role': '角色',
        'org:role': '角色',
        'ROLE': '角色',
        'resource': '人员ID',
        'org:resource': '人员ID',
        'PERSON_ID': '人员ID',
        'user_id': '用户ID',
        'USER_ID': '用户ID',
        'patient_id': '用户ID',
    }
    
    renamed = {}
    for old_name, new_name in column_mapping.items():
        if old_name in df.columns:
            renamed[old_name] = new_name
    
    if renamed:
        df = df.rename(columns=renamed)
        print(f"   重命名了 {len(renamed)} 个列:")
        for old, new in renamed.items():
            print(f"     '{old}' → '{new}'")
    else:
        print("   无需重命名")
    
    # ========== 2. 删除完全空的行和列 ==========
    print("\n2. 删除空行和空列")
    
    # 删除所有列都是空的行
    df = df.dropna(how='all')
    
    # 删除所有行都是空的列
    df = df.dropna(axis=1, how='all')
    
    print(f"   剩余: {len(df)} 行, {len(df.columns)} 列")
    
    # ========== 3. 删除关键字段缺失的行 ==========
    print("\n3. 删除关键字段缺失的行")
    
    required_fields = ['挂号ID', '活动名称', '开始时间']
    for field in required_fields:
        if field in df.columns:
            before = len(df)
            df = df.dropna(subset=[field])
            removed = before - len(df)
            if removed > 0:
                print(f"   删除 {field} 缺失的 {removed} 行")
    
    print(f"   剩余: {len(df)} 行")
    
    # ========== 4. 数据类型转换 ==========
    print("\n4. 数据类型转换")
    
    # 挂号ID转为字符串
    if '挂号ID' in df.columns:
        df['挂号ID'] = df['挂号ID'].astype(str).str.strip()
        print("   ✓ 挂号ID → 字符串")
    
    # 活动名称转为字符串并去除空格
    if '活动名称' in df.columns:
        df['活动名称'] = df['活动名称'].astype(str).str.strip()
        print("   ✓ 活动名称 → 字符串")
    
    # 时间字段转换
    if '开始时间' in df.columns:
        try:
            df['开始时间'] = pd.to_datetime(df['开始时间'])
            print("   ✓ 开始时间 → 日期时间")
        except Exception as e:
            print(f"   ⚠ 开始时间转换失败: {e}")
    
    if '结束时间' in df.columns:
        try:
            df['结束时间'] = pd.to_datetime(df['结束时间'], errors='coerce')
            print("   ✓ 结束时间 → 日期时间")
        except:
            pass
    
    # 持续时间转为整数
    if '持续时间' in df.columns:
        try:
            df['持续时间'] = pd.to_numeric(df['持续时间'], errors='coerce').fillna(0).astype(int)
            print("   ✓ 持续时间 → 整数")
        except:
            pass
    
    # ========== 5. 活动名称标准化 ==========
    print("\n5. 活动名称标准化")
    
    if '活动名称' in df.columns:
        # 删除空活动名
        before = len(df)
        df = df[df['活动名称'] != '']
        df = df[df['活动名称'] != 'nan']
        removed = before - len(df)
        if removed > 0:
            print(f"   删除空活动名: {removed} 行")
        
        # 标准化活动名称（示例）
        activity_standardization = {
            '挂号': ['挂号', '门诊挂号', '预约挂号', '挂号登记'],
            '检查': ['检查', '体检', '检验', '医学检查'],
            '报告审核': ['报告审核', '审核报告', '报告复核', '报告审查'],
            '诊断': ['诊断', '医生诊断', '初步诊断', '确诊'],
            '开方': ['开方', '开处方', '处方', '开药方'],
            '配药': ['配药', '药房配药', '取药配药'],
            '发药': ['发药', '药房发药', '取药'],
            '收费': ['收费', '缴费', '结算', '付费'],
            '开单': ['开单', '开检查单', '开化验单'],
        }
        
        standardized_count = 0
        for standard, variants in activity_standardization.items():
            mask = df['活动名称'].isin(variants)
            count = mask.sum()
            if count > 0:
                df.loc[mask, '活动名称'] = standard
                standardized_count += count
        
        if standardized_count > 0:
            print(f"   标准化了 {standardized_count} 个活动名称")
        
        # 显示活动分布
        activities = df['活动名称'].value_counts()
        print(f"   活动类型数: {len(activities)}")
        for activity, count in activities.items():
            print(f"     {activity}: {count}")
    
    # ========== 6. 删除重复事件 ==========
    print("\n6. 删除重复事件")
    
    before = len(df)
    df = df.drop_duplicates(subset=['挂号ID', '活动名称', '开始时间'])
    removed = before - len(df)
    if removed > 0:
        print(f"   删除了 {removed} 个重复事件")
    else:
        print("   无重复事件")
    
    # ========== 7. 时间排序 ==========
    print("\n7. 时间排序")
    
    if '挂号ID' in df.columns and '开始时间' in df.columns:
        df = df.sort_values(['挂号ID', '开始时间'])
        print("   ✓ 已按挂号ID和时间排序")
    
    # ========== 8. 计算缺失的持续时间 ==========
    print("\n8. 计算持续时间")
    
    if '开始时间' in df.columns and '结束时间' in df.columns:
        # 如果持续时间缺失但有开始和结束时间，计算它
        if '持续时间' not in df.columns:
            df['持续时间'] = 0
        
        mask = (df['持续时间'] == 0) & df['结束时间'].notna()
        if mask.any():
            df.loc[mask, '持续时间'] = (
                df.loc[mask, '结束时间'] - df.loc[mask, '开始时间']
            ).dt.total_seconds().astype(int)
            print(f"   计算了 {mask.sum()} 个持续时间")
    
    # ========== 9. 过滤不完整的案例 ==========
    print("\n9. 过滤不完整的案例")
    
    if '挂号ID' in df.columns:
        events_per_case = df.groupby('挂号ID').size()
        
        print(f"   案例统计:")
        print(f"     总案例数: {len(events_per_case)}")
        print(f"     平均事件数: {events_per_case.mean():.2f}")
        print(f"     最少事件数: {events_per_case.min()}")
        print(f"     最多事件数: {events_per_case.max()}")
        
        # 删除事件数过少的案例
        min_events = 2
        valid_cases = events_per_case[events_per_case >= min_events].index
        before = len(df)
        df = df[df['挂号ID'].isin(valid_cases)]
        removed = before - len(df)
        
        if removed > 0:
            print(f"   删除事件数 < {min_events} 的案例: {removed} 行")
        
        # 可选：删除事件数过多的异常案例
        max_events = events_per_case.quantile(0.95)  # 95分位数
        if max_events > 20:  # 如果95分位数很大，可能有异常
            outlier_cases = events_per_case[events_per_case > max_events * 2].index
            if len(outlier_cases) > 0:
                before = len(df)
                df = df[~df['挂号ID'].isin(outlier_cases)]
                removed = before - len(df)
                print(f"   删除异常案例 (事件数 > {max_events * 2:.0f}): {removed} 行")
    
    # ========== 10. 添加额外字段 ==========
    print("\n10. 添加额外字段")
    
    if '挂号ID' in df.columns:
        # 添加事件序号
        df['事件序号'] = df.groupby('挂号ID').cumcount() + 1
        print("   ✓ 添加事件序号")
    
    if '开始时间' in df.columns:
        # 添加日期和时间分量
        df['日期'] = df['开始时间'].dt.date
        df['小时'] = df['开始时间'].dt.hour
        df['星期'] = df['开始时间'].dt.dayofweek
        print("   ✓ 添加时间分量字段")
    
    # ========== 总结 ==========
    print("\n" + "=" * 80)
    print("清洗总结")
    print("=" * 80)
    
    print(f"\n原始数据: {len(df_original)} 行")
    print(f"清洗后: {len(df)} 行")
    print(f"删除: {len(df_original) - len(df)} 行 ({(len(df_original) - len(df)) / len(df_original) * 100:.1f}%)")
    
    if '挂号ID' in df.columns:
        print(f"\n案例数: {df['挂号ID'].nunique()}")
        print(f"平均每案例事件数: {df.groupby('挂号ID').size().mean():.2f}")
    
    if '活动名称' in df.columns:
        print(f"\n活动类型数: {df['活动名称'].nunique()}")
    
    print("\n" + "=" * 80)
    
    return df


def example_usage():
    """
    使用示例
    """
    # 创建示例数据
    data = {
        'case_id': ['001', '001', '001', '002', '002', '002', '003', '003'],
        'activity': ['挂号', '门诊挂号', '检查', '挂号', '检查', '报告审核', '挂号', '检查'],
        'timestamp': [
            '2023-05-14 10:00:00',
            '2023-05-14 10:05:00',  # 重复
            '2023-05-14 10:30:00',
            '2023-05-14 11:00:00',
            '2023-05-14 11:30:00',
            '2023-05-14 14:14:07',
            '2023-05-14 12:00:00',
            '2023-05-14 12:30:00',
        ],
        'role': ['挂号员', '挂号员', '检查科医生', '挂号员', '检查科医生', '检查检验科医生', '挂号员', '检查科医生']
    }
    
    df = pd.DataFrame(data)
    
    print("示例数据:")
    print(df)
    print("\n")
    
    # 清洗数据
    df_cleaned = clean_medical_data_advanced(df)
    
    print("\n清洗后数据:")
    print(df_cleaned)
    
    return df_cleaned


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        # 处理实际文件
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else 'cleaned_data.xlsx'
        
        print(f"读取文件: {input_file}")
        
        if input_file.endswith('.csv'):
            df = pd.read_csv(input_file, encoding='utf-8-sig')
        else:
            df = pd.read_excel(input_file)
        
        df_cleaned = clean_medical_data_advanced(df)
        
        # 保存清洗后的数据
        if output_file.endswith('.csv'):
            df_cleaned.to_csv(output_file, index=False, encoding='utf-8-sig')
        else:
            df_cleaned.to_excel(output_file, index=False)
        
        print(f"\n✓ 清洗后的数据已保存到: {output_file}")
    else:
        # 运行示例
        print("运行示例...")
        print("=" * 80)
        print("\n")
        example_usage()
        print("\n\n使用方法:")
        print("  python clean_data_example.py input.xlsx output.xlsx")




