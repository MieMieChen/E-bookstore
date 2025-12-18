#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速入门脚本 - 一键诊断和转换
"""

import os
import sys
import pandas as pd
from convert_to_xes import convert_to_xes, analyze_data_quality
from diagnose_data import diagnose_medical_data


def find_data_file():
    """
    自动查找数据文件
    """
    possible_files = [
        'medical_data.xlsx',
        'medical_data.xls',
        'medical_data.csv',
        '医疗数据.xlsx',
        '医疗数据.xls',
        '医疗数据.csv',
        'data.xlsx',
        'data.csv'
    ]
    
    for filename in possible_files:
        if os.path.exists(filename):
            return filename
    
    # 在当前目录查找所有 Excel/CSV 文件
    for filename in os.listdir('.'):
        if filename.endswith(('.xlsx', '.xls', '.csv')):
            return filename
    
    return None


def interactive_column_mapping(df):
    """
    交互式列名映射
    """
    print("\n" + "=" * 60)
    print("列名映射")
    print("=" * 60)
    print(f"\n发现的列: {list(df.columns)}")
    
    mapping = {}
    
    # 挂号ID
    print("\n1. 请选择'挂号ID'列（每次就诊的唯一标识）:")
    for i, col in enumerate(df.columns, 1):
        sample = df[col].dropna().head(3).tolist()
        print(f"   {i}. {col} - 示例: {sample}")
    
    choice = input("\n   请输入列号 (或按回车跳过): ").strip()
    if choice.isdigit() and 1 <= int(choice) <= len(df.columns):
        mapping[df.columns[int(choice) - 1]] = '挂号ID'
    
    # 活动名称
    print("\n2. 请选择'活动名称'列:")
    for i, col in enumerate(df.columns, 1):
        if col not in mapping:
            sample = df[col].dropna().head(3).tolist()
            print(f"   {i}. {col} - 示例: {sample}")
    
    choice = input("\n   请输入列号 (或按回车跳过): ").strip()
    if choice.isdigit() and 1 <= int(choice) <= len(df.columns):
        mapping[df.columns[int(choice) - 1]] = '活动名称'
    
    # 开始时间
    print("\n3. 请选择'开始时间'列:")
    for i, col in enumerate(df.columns, 1):
        if col not in mapping:
            sample = df[col].dropna().head(3).tolist()
            print(f"   {i}. {col} - 示例: {sample}")
    
    choice = input("\n   请输入列号 (或按回车跳过): ").strip()
    if choice.isdigit() and 1 <= int(choice) <= len(df.columns):
        mapping[df.columns[int(choice) - 1]] = '开始时间'
    
    if mapping:
        print(f"\n映射结果:")
        for old, new in mapping.items():
            print(f"  '{old}' → '{new}'")
        return mapping
    else:
        return None


def main():
    """
    主流程
    """
    print("=" * 80)
    print("医疗流程挖掘 - 快速入门")
    print("=" * 80)
    
    # 1. 查找数据文件
    print("\n步骤 1: 查找数据文件")
    
    if len(sys.argv) > 1:
        data_file = sys.argv[1]
    else:
        data_file = find_data_file()
    
    if not data_file:
        print("✗ 未找到数据文件")
        print("\n请将数据文件放在当前目录，或指定文件路径:")
        print("  python quick_start.py your_data.xlsx")
        return
    
    if not os.path.exists(data_file):
        print(f"✗ 文件不存在: {data_file}")
        return
    
    print(f"✓ 找到数据文件: {data_file}")
    
    # 2. 读取数据
    print("\n步骤 2: 读取数据")
    try:
        if data_file.endswith('.csv'):
            df = pd.read_csv(data_file, encoding='utf-8-sig')
        else:
            df = pd.read_excel(data_file)
        print(f"✓ 成功读取 {len(df)} 行数据")
    except Exception as e:
        print(f"✗ 读取失败: {e}")
        return
    
    # 3. 检查列名
    print("\n步骤 3: 检查列名")
    required = ['挂号ID', '活动名称', '开始时间']
    missing = [col for col in required if col not in df.columns]
    
    if missing:
        print(f"⚠ 缺少必需的列: {missing}")
        print("\n是否需要手动映射列名? (y/n): ", end='')
        response = input().strip().lower()
        
        if response == 'y':
            mapping = interactive_column_mapping(df)
            if mapping:
                df = df.rename(columns=mapping)
                print("\n✓ 列名映射完成")
            else:
                print("\n✗ 未完成列名映射")
                return
        else:
            print("\n✗ 无法继续，缺少必需的列")
            return
    else:
        print("✓ 所有必需的列都存在")
    
    # 4. 数据诊断
    print("\n步骤 4: 数据诊断")
    print("-" * 80)
    
    # 快速诊断
    case_ids = df['挂号ID'].astype(str)
    unique_cases = case_ids.nunique()
    events_per_case = df.groupby('挂号ID').size()
    activities = df['活动名称'].value_counts()
    
    print(f"案例数: {unique_cases}")
    print(f"事件数: {len(df)}")
    print(f"平均每案例事件数: {events_per_case.mean():.2f}")
    print(f"活动类型数: {len(activities)}")
    
    # 检查关键问题
    issues = []
    
    if unique_cases == len(df):
        issues.append("严重: 每行都是不同的挂号ID - Case ID 可能错误")
    
    if events_per_case.mean() < 2:
        issues.append("严重: 平均每案例事件数太少")
    
    if len(activities) < 3:
        issues.append("警告: 活动类型太少")
    
    if issues:
        print("\n⚠ 发现问题:")
        for issue in issues:
            print(f"  - {issue}")
        
        print("\n是否继续查看详细诊断? (y/n): ", end='')
        response = input().strip().lower()
        
        if response == 'y':
            print("\n" + "=" * 80)
            diagnose_medical_data(data_file)
            print("\n" + "=" * 80)
        
        print("\n是否仍要继续转换? (y/n): ", end='')
        response = input().strip().lower()
        
        if response != 'y':
            print("\n已取消")
            return
    else:
        print("\n✓ 数据看起来正常")
    
    # 5. 转换为 XES
    print("\n步骤 5: 转换为 XES 格式")
    
    output_file = 'medical_process.xes'
    
    try:
        convert_to_xes(df, output_file)
        print(f"\n✓ 转换成功!")
        print(f"  输出文件: {output_file}")
    except Exception as e:
        print(f"\n✗ 转换失败: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # 6. 下一步指引
    print("\n" + "=" * 80)
    print("转换完成！下一步:")
    print("=" * 80)
    print("\n1. 打开 ProM 软件")
    print(f"2. 选择 Import → {output_file}")
    print("3. 选择流程挖掘算法:")
    print("   - Inductive Miner (推荐)")
    print("   - Alpha Miner")
    print("   - Heuristic Miner")
    print("4. 可视化 Petri 网")
    
    print("\n期望的结果:")
    print("  ✓ 有清晰的主流程路径")
    print("  ✓ 活动之间有明确的因果关系")
    print("  ✓ 大部分案例遵循相似的路径")
    
    if issues:
        print("\n⚠ 注意:")
        print("  由于数据存在问题，挖掘结果可能不理想")
        print("  建议先解决数据问题后再重新转换")
    
    print("\n" + "=" * 80)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n已取消")
    except Exception as e:
        print(f"\n✗ 发生错误: {e}")
        import traceback
        traceback.print_exc()




