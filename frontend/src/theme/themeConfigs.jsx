import { theme } from 'antd';

export const customTheme = {
  token: {
    // 颜色
    colorPrimary: '#673ab7', // 主题色
    colorSuccess: '#52c41a', // 成功色
    colorWarning: '#faad14', // 警告色
    colorError: '#ff4d4f',   // 错误色
    colorInfo: '#9c27b0',    // 信息色
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    
    // 圆角
    borderRadius: 8,
    
    // 间距
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,
    
    // 控件大小
    controlHeightSM: 24,    // 小号控件高度
    controlHeight: 32,      // 中号控件高度
    controlHeightLG: 40,    // 大号控件高度
    
    // 其他
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    
    // 背景色
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
  },
  
  components: {
    Button: {
      // 按钮相关
      borderRadius: 4,
      // primaryColor: '#673ab7',
      colorPrimary: '#673ab7', // 默认背景颜色
      colorPrimaryActive: '#512da8', // 按下时的背景颜色
      defaultBg: '#ffffff',
      defaultBorderColor: '#d9d9d9',
    },
    
    Card: {
      // 卡片相关
      borderRadius: 8,
      boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
    },
    
    Menu: {
      // 菜单相关
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(95, 9, 244, 0.1)',
      itemHoverBg: 'rgba(103, 58, 183, 0.05)',
    },
    
    Layout: {
      // 布局相关
      bodyBg: '#f5f5f5',
      headerBg: '#673ab7',
      siderBg: '#ffffff',
    },
    
    Table: {
      // 表格相关
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: 'rgba(58, 183, 96, 0.05)',
    },
    
    Input: {
      // 输入框相关
      activeBorderColor: '#673ab7',
      hoverBorderColor: '#9575cd',
    }
  }
};