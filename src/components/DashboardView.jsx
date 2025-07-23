import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Divider
} from '@mui/material'
import {
  Home,
  People,
  AttachMoney,
  Warning,
  Add,
  Payment,
  Visibility,
  TrendingUp
} from '@mui/icons-material'

const DashboardView = () => {
  const stats = [
    {
      title: 'Total Properties',
      value: '24',
      change: '+2 this month',
      icon: <Home sx={{ fontSize: 40, color: '#2196F3' }} />,
      color: '#2196F3'
    },
    {
      title: 'Active Tenants',
      value: '18',
      change: '+1 this week',
      icon: <People sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#4CAF50'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,500',
      change: '+8% from last month',
      icon: <AttachMoney sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FF9800'
    },
    {
      title: 'Outstanding Payments',
      value: '3',
      change: '2 overdue',
      icon: <Warning sx={{ fontSize: 40, color: '#F44336' }} />,
      color: '#F44336'
    }
  ]

  const recentPayments = [
    {
      tenant: 'Sarah Johnson',
      property: 'Oak Street Apt 2B',
      amount: '$1,200',
      date: 'Jan 15',
      status: 'Paid'
    },
    {
      tenant: 'Mike Chen',
      property: 'Pine Ave House',
      amount: '$2,100',
      date: 'Jan 14',
      status: 'Paid'
    },
    {
      tenant: 'Emma Davis',
      property: 'Maple Court Unit 5A',
      amount: '$950',
      date: 'Jan 13',
      status: 'Paid'
    }
  ]

  const quickActions = [
    { title: 'Add New Tenant', icon: <Add />, color: 'primary' },
    { title: 'Record Payment', icon: <Payment />, color: 'secondary' },
    { title: 'Add Property', icon: <Home />, color: 'primary' },
    { title: 'View Outstanding', icon: <Warning />, color: 'error' }
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's your property overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Payments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Payments
            </Typography>
            <List>
              {recentPayments.map((payment, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {payment.tenant}
                          </Typography>
                          <Chip 
                            label={payment.status} 
                            size="small" 
                            color="success"
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {payment.property}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {payment.amount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {payment.date}
                        </Typography>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentPayments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={action.icon}
                  color={action.color}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: `${action.color === 'primary' ? '#2196F3' : action.color === 'secondary' ? '#FF9800' : '#F44336'}10`
                    }
                  }}
                >
                  {action.title}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardView
