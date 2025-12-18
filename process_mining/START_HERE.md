# 🚀 开始使用 - 流程挖掘工具

## 📌 您的问题

您的 Petri 网图显示流程过于发散，所有活动都直接连到结束节点，这是因为 **Case ID (挂号ID) 使用错误**。

## ⚡ 快速解决（3步）

### 步骤 1: 安装依赖

```bash
cd process_mining
pip install -r requirements.txt
```

### 步骤 2: 诊断数据

```bash
python diagnose_data.py your_data.xlsx
```

**关键：** 查看输出中的这一部分：

```
5. 挂号ID (Case ID) 分析:
   平均每案例事件数: X.XX
```

- 如果平均事件数 < 2 → **Case ID 错误！**
- 如果平均事件数 > 3 → 可能正确

### 步骤 3: 转换为 XES

```bash
python quick_start.py your_data.xlsx
```

然后在 ProM 中导入 `medical_process.xes`。

## 🔍 最可能的问题

### 问题：使用了用户ID而不是挂号ID

```
❌ 错误数据结构：
USER_ID | 活动名称 | 时间
2400    | 挂号    | 5月14日 10:00
2400    | 检查    | 5月14日 10:30
2400    | 挂号    | 5月15日 10:00  ← 这是另一次就诊！
2400    | 检查    | 5月15日 10:30

→ 如果用 USER_ID 作为 Case ID，ProM 会把所有就诊混在一起

✅ 正确数据结构：
挂号ID  | USER_ID | 活动名称 | 时间
REG001 | 2400   | 挂号    | 5月14日 10:00
REG001 | 2400   | 检查    | 5月14日 10:30
REG002 | 2400   | 挂号    | 5月15日 10:00
REG002 | 2400   | 检查    | 5月15日 10:30

→ 每次就诊有独立的挂号ID
```

## 🛠️ 如果数据中没有挂号ID

运行这个脚本生成挂号ID：

```python
import pandas as pd

# 读取数据
df = pd.read_excel('your_data.xlsx')

# 转换时间
df['开始时间'] = pd.to_datetime(df['开始时间'])

# 按用户和时间排序
df = df.sort_values(['USER_ID', '开始时间'])

# 计算时间间隔（小时）
df['时间差'] = df.groupby('USER_ID')['开始时间'].diff().dt.total_seconds() / 3600

# 如果时间差 > 4小时，认为是新的就诊
df['新就诊'] = (df['时间差'] > 4) | df['时间差'].isna()

# 生成挂号ID
df['就诊序号'] = df.groupby('USER_ID')['新就诊'].cumsum()
df['挂号ID'] = df['USER_ID'].astype(str) + '_V' + df['就诊序号'].astype(str)

# 删除辅助列
df = df.drop(['时间差', '新就诊', '就诊序号'], axis=1)

# 保存
df.to_excel('fixed_data.xlsx', index=False)

print("✓ 已生成挂号ID，保存到 fixed_data.xlsx")
print(f"  总案例数: {df['挂号ID'].nunique()}")
print(f"  平均每案例事件数: {df.groupby('挂号ID').size().mean():.2f}")
```

然后对 `fixed_data.xlsx` 运行转换。

## 📊 数据格式要求

必需的列：

| 列名 | 说明 |
|------|------|
| 挂号ID | 每次就诊的唯一ID（不是用户ID！） |
| 活动名称 | 流程步骤名称 |
| 开始时间 | 活动开始时间 |

## ✅ 预期结果

正确的 Petri 网应该是：

```
挂号 → 检查 → 报告审核 → 诊断 → 开方 → 配药 → 发药 → 收费
```

而不是所有活动都发散连接。

## 📚 详细文档

- **使用指南.md** - 完整的中文使用指南
- **总结.md** - 问题诊断和解决方案
- **README.md** - 英文文档

## 🆘 需要帮助？

运行诊断脚本并查看输出：

```bash
python diagnose_data.py your_data.xlsx > diagnosis.txt
```

然后检查 `diagnosis.txt` 中的问题提示。

---

**记住：挂号ID ≠ 用户ID**

挂号ID 是每次就诊的唯一标识，一个用户可以有多个挂号ID（多次就诊）。




