import { theme } from 'antd';

export const customTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#673ab7',
    colorInfo: '#9c27b0',
    borderRadius: 8,
    colorBgContainer: '#f5f5f5',
  },
  components: {
    Button: {
      colorPrimary: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)',
    },
    Layout: {
      headerBg: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)',
    }
  }
};