import { styled } from '@mui/material/styles';
import { Box, Paper, Container } from '@mui/material';

// 页面容器
export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

// 内容容器
export const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

// 卡片容器
export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

// 图片容器
export const ImageContainer = styled(Box)(({ theme }) => ({
  '& img': {
    width: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

// 弹性布局容器
export const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

// 带间距的弹性布局
export const FlexSpaceBetween = styled(FlexBox)({
  justifyContent: 'space-between',
});

// 商品信息容器
export const ProductInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// 操作按钮容器
export const ActionButtons = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
})); 