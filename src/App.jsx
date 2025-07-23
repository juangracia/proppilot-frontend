import React, { useState, useMemo } from 'react'
import {
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container
} from '@mui/material'
import { 
  Brightness4, 
  Brightness7, 
  Dashboard,
  Home,
  Payment,
  People,
  Menu
} from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import DashboardView from './components/DashboardView'
import PropertyUnitsList from './components/PropertyUnitsList'
import PaymentForm from './components/PaymentForm'
import TenantsList from './components/TenantsList'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import LanguageCurrencySelector from './components/LanguageCurrencySelector'
import './App.css'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, value: 0 },
  { text: 'Properties', icon: <Home />, value: 1 },
  { text: 'Tenants', icon: <People />, value: 2 },
  { text: 'Payments', icon: <Payment />, value: 3 }
]

function AppContent() {
  const [selectedView, setSelectedView] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLanguage()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (value) => {
    setSelectedView(value)
    setMobileOpen(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#2196F3',
          },
          secondary: {
            main: '#FF9800',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          h4: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                borderRight: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
              },
            },
          },
        },
      }),
    [darkMode]
  )

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Home sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            PropPilot
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleMenuClick(item.value)}
            selected={selectedView === item.value}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: selectedView === item.value ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  const renderContent = () => {
    switch (selectedView) {
      case 0:
        return <DashboardView />
      case 1:
        return <PropertyUnitsList />
      case 2:
        return <TenantsList />
      case 3:
        return <PaymentForm />
      default:
        return <DashboardView />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex' }}>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Professional Rental Management
              </Typography>
              <LanguageCurrencySelector />
              <IconButton
                color="inherit"
                onClick={() => setDarkMode(!darkMode)}
                sx={{ ml: 1 }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              mt: '64px',
              backgroundColor: 'background.default',
              minHeight: '100vh',
            }}
          >
            <Container maxWidth="xl">
              {renderContent()}
            </Container>
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
