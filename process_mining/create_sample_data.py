#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
创建示例医疗流程数据
用于测试 XES 转换工具
"""

import pandas as pd
from datetime import datetime, timedelta
import random


def create_sample_medical_data():
    """
    创建示例医疗流程数据
    """
    print("创建示例医疗流程数据...")
    
    # 定义标准流程
    standard_flows = [
        # 完整流程
        ['挂号', '检查', '报告审核', '诊断', '开方', '配药', '发药', '收费'],
        # 简化流程（不需要检查）
        ['挂号', '诊断', '开方', '配药', '发药', '收费'],
        # 需要开单的流程
        ['挂号', '开单', '检查', '报告审核', '诊断', '开方', '配药', '发药', '收费'],
        # 只检查不开药
        ['挂号', '检查', '报告审核', '诊断', '收费'],
        # 复诊流程
        ['挂号', '诊断', '开方', '收费'],
    ]
    
    # 角色映射
    role_mapping = {
        '挂号': ['挂号员', '挂号员'],
        '开单': ['门诊医生', '主治医生'],
        '检查': ['检查科医生', '检验科医生', '影像科医生'],
        '报告审核': ['检查检验科医生', '影像科主任'],
        '诊断': ['门诊医生', '主治医生', '专家'],
        '开方': ['门诊医生', '主治医生'],
        '配药': ['药房药师', '药剂师'],
        '发药': ['药房药师', '药剂师'],
        '收费': ['收费员', '财务人员'],
    }
    
    data = []
    
    # 生成50个案例
    base_date = datetime(2023, 5, 14, 8, 0, 0)
    
    for case_num in range(1, 51):
        # 随机选择一个流程
        flow = random.choice(standard_flows)
        
        # 随机选择一个用户
        user_id = random.randint(2000, 2100)
        
        # 生成挂号ID
        registration_id = f"REG{base_date.strftime('%Y%m%d')}{case_num:03d}"
        
        # 当前时间（每个案例开始时间不同）
        current_time = base_date + timedelta(hours=case_num * 0.5)
        
        # 生成该案例的所有事件
        for activity in flow:
            # 活动开始时间
            start_time = current_time
            
            # 活动持续时间（分钟）
            duration_minutes = {
                '挂号': random.randint(3, 8),
                '开单': random.randint(5, 15),
                '检查': random.randint(15, 45),
                '报告审核': random.randint(3, 10),
                '诊断': random.randint(10, 30),
                '开方': random.randint(5, 15),
                '配药': random.randint(5, 15),
                '发药': random.randint(2, 5),
                '收费': random.randint(2, 5),
            }[activity]
            
            # 活动结束时间
            end_time = start_time + timedelta(minutes=duration_minutes)
            
            # 选择角色和人员
            role = random.choice(role_mapping[activity])
            person_id = f"{role}_P{random.randint(1, 30):02d}"
            
            # 添加事件
            data.append({
                '挂号ID': registration_id,
                '用户ID': user_id,
                '活动名称': activity,
                '开始时间': start_time,
                '结束时间': end_time,
                '持续时间': duration_minutes * 60,  # 转换为秒
                '角色': role,
                '人员ID': person_id,
            })
            
            # 下一个活动的开始时间（加上等待时间）
            wait_minutes = random.randint(5, 30)
            current_time = end_time + timedelta(minutes=wait_minutes)
    
    # 创建 DataFrame
    df = pd.DataFrame(data)
    
    print(f"✓ 生成了 {len(df)} 个事件，{df['挂号ID'].nunique()} 个案例")
    
    return df


def create_wrong_sample_data():
    """
    创建错误的示例数据（使用用户ID作为Case ID）
    用于演示问题
    """
    print("\n创建错误示例数据（用于对比）...")
    
    activities = ['挂号', '检查', '报告审核', '诊断', '开方', '配药', '发药', '收费']
    
    data = []
    base_date = datetime(2023, 5, 14, 8, 0, 0)
    
    # 只生成10个用户，但每个用户有多次就诊
    for user_id in range(2400, 2410):
        # 每个用户2-3次就诊
        num_visits = random.randint(2, 3)
        
        for visit in range(num_visits):
            current_time = base_date + timedelta(days=visit, hours=user_id % 12)
            
            # 随机选择3-5个活动
            selected_activities = random.sample(activities, random.randint(3, 5))
            
            for activity in selected_activities:
                start_time = current_time
                duration = random.randint(5, 30)
                end_time = start_time + timedelta(minutes=duration)
                
                data.append({
                    'USER_ID': user_id,  # 注意：这里只有用户ID，没有挂号ID
                    'concept:name': activity,
                    'time:timestamp': start_time,
                    'ACTIVITY_END': end_time,
                    'DURATION': duration * 60,
                })
                
                current_time = end_time + timedelta(minutes=random.randint(10, 30))
    
    df = pd.DataFrame(data)
    
    print(f"✓ 生成了 {len(df)} 个事件，{df['USER_ID'].nunique()} 个用户")
    print(f"  注意：这个数据没有挂号ID，会导致流程挖掘错误！")
    
    return df


if __name__ == '__main__':
    # 创建正确的示例数据
    df_correct = create_sample_medical_data()
    
    # 保存
    df_correct.to_excel('sample_data_correct.xlsx', index=False)
    df_correct.to_csv('sample_data_correct.csv', index=False, encoding='utf-8-sig')
    
    print(f"\n✓ 正确的示例数据已保存:")
    print(f"  - sample_data_correct.xlsx")
    print(f"  - sample_data_correct.csv")
    
    # 显示数据样例
    print("\n数据样例（前10行）:")
    print(df_correct.head(10))
    
    # 显示统计信息
    print("\n统计信息:")
    print(f"  案例数: {df_correct['挂号ID'].nunique()}")
    print(f"  事件数: {len(df_correct)}")
    print(f"  平均每案例事件数: {df_correct.groupby('挂号ID').size().mean():.2f}")
    print(f"  活动类型: {df_correct['活动名称'].unique().tolist()}")
    
    # 显示流程变体
    print("\n最常见的流程变体:")
    variants = df_correct.groupby('挂号ID')['活动名称'].apply(lambda x: ' → '.join(x))
    for variant, count in variants.value_counts().head(5).items():
        print(f"  [{count}次] {variant}")
    
    # 创建错误的示例数据
    print("\n" + "=" * 80)
    df_wrong = create_wrong_sample_data()
    
    # 保存
    df_wrong.to_excel('sample_data_wrong.xlsx', index=False)
    
    print(f"\n✓ 错误的示例数据已保存:")
    print(f"  - sample_data_wrong.xlsx")
    print(f"  （这个数据只有用户ID，没有挂号ID）")
    
    print("\n" + "=" * 80)
    print("下一步:")
    print("=" * 80)
    print("\n1. 测试正确的数据:")
    print("   python diagnose_data.py sample_data_correct.xlsx")
    print("   python quick_start.py sample_data_correct.xlsx")
    print("\n2. 测试错误的数据（对比）:")
    print("   python diagnose_data.py sample_data_wrong.xlsx")
    print("   （会看到警告信息）")
    print("\n3. 在 ProM 中对比两个 XES 文件的挖掘结果")




