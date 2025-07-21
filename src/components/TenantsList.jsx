import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useLanguage } from '../contexts/LanguageContext'

const API_BASE_URL = 'http://localhost:8080/api'

const TenantsList = () => {
  const { t } = useLanguage()
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    email: '',
    phone: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Load tenants on component mount
  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/tenants`)
      if (response.ok) {
        const data = await response.json()
        setTenants(data)
      } else {
        showSnackbar(t('errorOccurred'), 'error')
      }
    } catch (error) {
      console.error('Error loading tenants:', error)
      showSnackbar(t('errorOccurred'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const openAddDialog = () => {
    setEditingTenant(null)
    setFormData({ fullName: '', nationalId: '', email: '', phone: '' })
    setFormErrors({})
    setDialogOpen(true)
  }

  const openEditDialog = (tenant) => {
    setEditingTenant(tenant)
    setFormData({
      fullName: tenant.fullName,
      nationalId: tenant.nationalId,
      email: tenant.email,
      phone: tenant.phone
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTenant(null)
    setFormData({ fullName: '', nationalId: '', email: '', phone: '' })
    setFormErrors({})
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' })
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'El nombre completo es requerido'
    }
    
    if (!formData.nationalId.trim()) {
      errors.nationalId = 'El DNI/CUIT es requerido'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El formato del email no es válido'
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es requerido'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const url = editingTenant 
        ? `${API_BASE_URL}/tenants/${editingTenant.id}`
        : `${API_BASE_URL}/tenants`
      
      const method = editingTenant ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadTenants()
        handleCloseDialog()
        showSnackbar(
          editingTenant ? t('tenantUpdatedSuccess') : t('tenantCreatedSuccess')
        )
      } else if (response.status === 400) {
        // Handle validation errors from backend
        const errorText = await response.text()
        if (errorText.includes('national ID')) {
          showSnackbar(t('duplicateNationalId'), 'error')
        } else if (errorText.includes('email')) {
          showSnackbar(t('duplicateEmail'), 'error')
        } else {
          showSnackbar(t('errorOccurred'), 'error')
        }
      } else {
        showSnackbar(
          editingTenant ? t('failedToUpdateTenant') : t('failedToCreateTenant'), 
          'error'
        )
      }
    } catch (error) {
      console.error('Error saving tenant:', error)
      showSnackbar(
        editingTenant ? t('failedToUpdateTenant') : t('failedToCreateTenant'), 
        'error'
      )
    }
  }

  const openDeleteDialog = (tenant) => {
    setTenantToDelete(tenant)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setTenantToDelete(null)
  }

  const handleDelete = async () => {
    if (!tenantToDelete) return

    try {
      const response = await fetch(`${API_BASE_URL}/tenants/${tenantToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadTenants()
        showSnackbar(t('tenantDeletedSuccess'))
      } else {
        showSnackbar(t('failedToDeleteTenant'), 'error')
      }
    } catch (error) {
      console.error('Error deleting tenant:', error)
      showSnackbar(t('failedToDeleteTenant'), 'error')
    } finally {
      handleCloseDeleteDialog()
    }
  }

  const getTotalTenantsText = () => {
    const count = tenants.length
    const plural = count !== 1 ? 's' : ''
    return t('totalTenants').replace('{count}', count).replace('{plural}', plural)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          {t('loading')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('tenantsTitle')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openAddDialog}
          sx={{ fontWeight: 'bold' }}
        >
          {t('addTenant')}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {getTotalTenantsText()}
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('id')}</TableCell>
              <TableCell>{t('fullName')}</TableCell>
              <TableCell>{t('nationalId')}</TableCell>
              <TableCell>{t('email')}</TableCell>
              <TableCell>{t('phone')}</TableCell>
              <TableCell align="center">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id} hover>
                <TableCell>{tenant.id}</TableCell>
                <TableCell>{tenant.fullName}</TableCell>
                <TableCell>{tenant.nationalId}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => openEditDialog(tenant)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => openDeleteDialog(tenant)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTenant ? t('editTenantTitle') : t('addNewTenant')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label={t('fullNameLabel')}
              placeholder={t('fullNamePlaceholder')}
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              error={!!formErrors.fullName}
              helperText={formErrors.fullName}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('nationalIdLabel')}
              placeholder={t('nationalIdPlaceholder')}
              value={formData.nationalId}
              onChange={(e) => handleInputChange('nationalId', e.target.value)}
              error={!!formErrors.nationalId}
              helperText={formErrors.nationalId}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('phoneLabel')}
              placeholder={t('phonePlaceholder')}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirmDeleteMessage')}
          </Typography>
          {tenantToDelete && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              {tenantToDelete.fullName} ({tenantToDelete.nationalId})
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TenantsList
