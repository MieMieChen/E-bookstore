#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
医疗流程数据诊断工具
帮助识别数据问题
"""

import pandas as pd
import sys


def diagnose_medical_data(file_path):
    """
    诊断医疗流程数据
    """
    print("=" * 80)
    print("医疗流程数据诊断工具")
    print("=" * 80)
    
    # 读取数据
    print(f"\n1. 读取文件: {file_path}")
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path, encoding='utf-8-sig')
        else:
            df = pd.read_excel(file_path)
        print(f"   ✓ 成功读取 {len(df)} 行数据")
    except Exception as e:
        print(f"   ✗ 读取失败: {e}")
        return
    
    # 检查列名
    print(f"\n2. 列名检查:")
    print(f"   发现的列: {list(df.columns)}")
    
    # 映射常见的列名变体
    column_mapping = {
        '挂号ID': ['挂号ID', '挂号id', 'registration_id', 'case_id', 'CASE_ID', '案例ID'],
        '活动名称': ['活动名称', '活动', 'activity', 'concept:name', 'ACTIVITY', '事件'],
        '开始时间': ['开始时间', '时间', 'timestamp', 'time:timestamp', 'START_TIME', '时间戳'],
        '结束时间': ['结束时间', 'end_time', 'ACTIVITY_END', 'END_TIME'],
        '角色': ['角色', 'role', 'org:role', 'ROLE'],
        '人员ID': ['人员ID', '资源', 'resource', 'org:resource', 'PERSON_ID'],
        '持续时间': ['持续时间', 'duration', 'DURATION'],
        '用户ID': ['用户ID', 'user_id', 'USER_ID', '患者ID']
    }
    
    # 尝试自动映射列名
    print(f"\n3. 列名映射建议:")
    renamed_columns = {}
    for standard_name, variants in column_mapping.items():
        for col in df.columns:
            if col in variants:
                renamed_columns[col] = standard_name
                if col != standard_name:
                    print(f"   '{col}' → '{standard_name}'")
                break
    
    if renamed_columns:
        df = df.rename(columns=renamed_columns)
        print(f"   ✓ 已自动映射 {len(renamed_columns)} 个列名")
    
    # 检查必需字段
    print(f"\n4. 必需字段检查:")
    required_fields = ['挂号ID', '活动名称', '开始时间']
    all_required_present = True
    
    for field in required_fields:
        if field in df.columns:
            missing = df[field].isna().sum()
            if missing > 0:
                print(f"   ⚠ {field}: 存在但有 {missing} 个缺失值")
            else:
                print(f"   ✓ {field}: 完整")
        else:
            print(f"   ✗ {field}: 缺失")
            all_required_present = False
    
    if not all_required_present:
        print("\n   错误: 缺少必需字段，无法继续")
        return
    
    # 检查挂号ID分布
    print(f"\n5. 挂号ID (Case ID) 分析:")
    case_ids = df['挂号ID'].astype(str)
    unique_cases = case_ids.nunique()
    print(f"   唯一挂号ID数量: {unique_cases}")
    
    if unique_cases == len(df):
        print(f"   ✗ 警告: 每行都是不同的挂号ID！")
        print(f"      这意味着没有案例包含多个事件")
        print(f"      请检查是否使用了错误的列作为挂号ID")
        print(f"\n   可能的原因:")
        print(f"   - 使用了事件ID而不是挂号ID")
        print(f"   - 使用了用户ID而不是挂号ID")
        print(f"   - 数据中每个挂号只有一个事件（不太可能）")
    elif unique_cases < 10:
        print(f"   ⚠ 警告: 挂号ID数量很少，可能不正确")
    else:
        print(f"   ✓ 看起来正常")
    
    # 每个案例的事件数
    events_per_case = df.groupby('挂号ID').size()
    print(f"\n6. 每个案例的事件数统计:")
    print(f"   平均: {events_per_case.mean():.2f}")
    print(f"   中位数: {events_per_case.median():.0f}")
    print(f"   最小: {events_per_case.min()}")
    print(f"   最大: {events_per_case.max()}")
    
    if events_per_case.mean() < 2:
        print(f"   ✗ 警告: 平均每案例事件数太少！")
        print(f"      正常的医疗流程应该包含多个步骤")
    
    # 显示事件数分布
    print(f"\n   事件数分布:")
    distribution = events_per_case.value_counts().sort_index()
    for count, freq in distribution.head(10).items():
        print(f"     {count} 个事件: {freq} 个案例")
    
    # 活动名称分析
    print(f"\n7. 活动名称分析:")
    activities = df['活动名称'].value_counts()
    print(f"   唯一活动数: {len(activities)}")
    print(f"   活动分布:")
    for activity, count in activities.items():
        percentage = (count / len(df)) * 100
        print(f"     {activity}: {count} 次 ({percentage:.1f}%)")
    
    # 检查是否有异常活动名
    if activities.max() == len(df):
        print(f"   ✗ 警告: 所有事件都是同一个活动！")
    
    # 时间分析
    print(f"\n8. 时间字段分析:")
    try:
        df['开始时间_parsed'] = pd.to_datetime(df['开始时间'])
        print(f"   ✓ 时间格式正确")
        print(f"   时间范围: {df['开始时间_parsed'].min()} 到 {df['开始时间_parsed'].max()}")
        
        # 检查时间排序
        df_sorted = df.sort_values(['挂号ID', '开始时间_parsed'])
        if not df.equals(df_sorted):
            print(f"   ⚠ 数据未按时间排序，建议排序后再转换")
    except Exception as e:
        print(f"   ✗ 时间格式错误: {e}")
        print(f"   示例值: {df['开始时间'].head().tolist()}")
    
    # 检查流程变体
    print(f"\n9. 流程变体分析:")
    variants = df.groupby('挂号ID')['活动名称'].apply(lambda x: ' → '.join(x.astype(str)))
    unique_variants = variants.value_counts()
    print(f"   唯一流程变体数: {len(unique_variants)}")
    print(f"   最常见的流程变体:")
    for variant, count in unique_variants.head(5).items():
        print(f"     [{count}次] {variant}")
    
    if len(unique_variants) == unique_cases:
        print(f"   ⚠ 警告: 每个案例都有不同的流程路径")
        print(f"      这可能表明数据质量问题或流程非常灵活")
    
    # 数据样例
    print(f"\n10. 数据样例 (前3个案例):")
    for case_id in df['挂号ID'].unique()[:3]:
        case_data = df[df['挂号ID'] == case_id].sort_values('开始时间')
        print(f"\n   案例 {case_id}:")
        for idx, row in case_data.iterrows():
            print(f"     - {row['活动名称']} @ {row['开始时间']}")
    
    # 总结和建议
    print(f"\n" + "=" * 80)
    print("诊断总结和建议")
    print("=" * 80)
    
    issues = []
    
    if unique_cases == len(df):
        issues.append("严重: 每行都是不同的挂号ID，请检查Case ID列是否正确")
    
    if events_per_case.mean() < 2:
        issues.append("严重: 平均每案例事件数太少")
    
    if len(activities) < 3:
        issues.append("警告: 活动类型太少")
    
    if len(unique_variants) == unique_cases:
        issues.append("警告: 流程变体过多，可能存在数据质量问题")
    
    if issues:
        print("\n发现的问题:")
        for i, issue in enumerate(issues, 1):
            print(f"{i}. {issue}")
        
        print("\n建议:")
        print("1. 确认'挂号ID'列是否真的是挂号/就诊ID（同一次就诊的所有事件应该有相同的ID）")
        print("2. 检查数据是否完整（每个案例应该包含多个步骤）")
        print("3. 确认活动名称是否标准化（避免同一活动有多个名称）")
        print("4. 按时间排序数据")
    else:
        print("\n✓ 数据看起来正常，可以进行XES转换")
    
    print("=" * 80)
    
    # 生成清洗建议
    if issues:
        print("\n是否需要生成数据清洗脚本? (y/n): ", end='')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python diagnose_data.py <数据文件路径>")
        print("示例: python diagnose_data.py medical_data.xlsx")
        sys.exit(1)
    
    file_path = sys.argv[1]
    diagnose_medical_data(file_path)




