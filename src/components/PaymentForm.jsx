import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

const API_BASE_URL = '/api'

function PaymentForm() {
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState({
    propertyUnitId: '',
    amount: '',
    paymentDate: null,
    paymentType: 'RENT',
    description: ''
  })
  
  const [validationErrors, setValidationErrors] = useState({})
  const [propertyUnits, setPropertyUnits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const paymentTypes = [
    { value: 'RENT', label: t('rentPayment') },
    { value: 'DEPOSIT', label: t('depositPayment') },
    { value: 'MAINTENANCE', label: t('maintenancePayment') },
    { value: 'UTILITY', label: t('utilityPayment') },
    { value: 'OTHER', label: t('otherPayment') }
  ]

  useEffect(() => {
    fetchPropertyUnits()
  }, [])

  const fetchPropertyUnits = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/property-units`)
      setPropertyUnits(response.data)
    } catch (err) {
      console.error('Error fetching property units:', err)
      setError('Failed to load property units. Please make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    // Property unit validation
    if (!formData.propertyUnitId) {
      errors.propertyUnitId = 'Property unit is required'
    }
    
    // Amount validation
    if (!formData.amount) {
      errors.amount = 'Payment amount is required'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Payment amount must be greater than 0'
      } else if (amount > 999999.99) {
        errors.amount = 'Payment amount cannot exceed 999,999.99'
      }
    }
    
    // Date validation
    if (!formData.paymentDate) {
      errors.paymentDate = 'Payment date is required'
    } else if (formData.paymentDate > new Date()) {
      errors.paymentDate = 'Payment date cannot be in the future'
    }
    
    // Description validation
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError(t('fixValidationErrors'))
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    setValidationErrors({})
    
    try {
      const paymentData = {
        propertyUnit: { id: parseInt(formData.propertyUnitId) },
        amount: parseFloat(formData.amount),
        paymentDate: format(formData.paymentDate, 'yyyy-MM-dd'),
        paymentType: formData.paymentType,
        description: formData.description || null
      }
      
      const response = await axios.post(`${API_BASE_URL}/payments`, paymentData)
      
      if (response.status === 201) {
        setSuccess(t('paymentRegisteredSuccess'))
        setFormData({
          propertyUnitId: '',
          amount: '',
          paymentDate: null,
          paymentType: 'RENT',
          description: ''
        })
        setValidationErrors({})
      }
    } catch (err) {
      console.error('Error creating payment:', err)
      
      // Handle validation errors from backend
      if (err.response?.status === 400 && err.response?.data?.validationErrors) {
        setValidationErrors(err.response.data.validationErrors)
        setError(t('fixValidationErrors'))
      } else {
        setError(err.response?.data?.message || t('failedToRegisterPayment'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // Clear messages when user starts typing
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      paymentDate: newDate
    }))
  }

  const selectedPropertyUnit = propertyUnits.find(unit => unit.id === parseInt(formData.propertyUnitId))

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <Paper sx={{ p: 3, mx: 0 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('registerPaymentTitle')}
          </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!validationErrors.propertyUnitId}>
                  <InputLabel>{t('propertyUnitLabel')}</InputLabel>
                  <Select
                    value={formData.propertyUnitId}
                    onChange={(e) => setFormData({ ...formData, propertyUnitId: e.target.value })}
                    label={t('propertyUnitLabel')}
                  >
                    {propertyUnits.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.address} ({unit.type})
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.propertyUnitId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {validationErrors.propertyUnitId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label={t('paymentAmountLabel')}
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  fullWidth
                  required
                  error={!!validationErrors.amount}
                  helperText={validationErrors.amount}
                  inputProps={{ step: '0.01', min: '0.01', max: '999999.99' }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label={t('paymentDateLabel')}
                  value={formData.paymentDate}
                  onChange={(date) => setFormData({ ...formData, paymentDate: date })}
                  maxDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!validationErrors.paymentDate,
                      helperText: validationErrors.paymentDate
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label={t('paymentTypeLabel')}
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  fullWidth
                  required
                >
                  {paymentTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={t('descriptionLabel')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!validationErrors.description}
                  helperText={validationErrors.description || t('charactersCount', { count: formData.description.length })}
                  inputProps={{ maxLength: 500 }}
                />
              </Grid>

              {selectedPropertyUnit && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1,
                    bgcolor: 'background.default'
                  }}>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      {t('selectedPropertyDetails')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2">
                        <strong>Address:</strong> {selectedPropertyUnit.address}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {selectedPropertyUnit.type}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Base Rent:</strong> ${selectedPropertyUnit.baseRentAmount?.toFixed(2)}
                      </Typography>
                      {selectedPropertyUnit.tenant && (
                        <Typography variant="body2">
                          <strong>Tenant:</strong> {selectedPropertyUnit.tenant.firstName} {selectedPropertyUnit.tenant.lastName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  pt: 2,
                  borderTop: 1,
                  borderColor: 'divider'
                }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setFormData({
                        propertyUnitId: '',
                        amount: '',
                        paymentDate: new Date(),
                        paymentType: 'RENT',
                        description: ''
                      })
                      setError('')
                      setSuccess('')
                      setValidationErrors({})
                    }}
                    sx={{ minWidth: 100 }}
                  >
                    {t('clearForm')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 140 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t('registerPaymentAction')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        </Paper>
      </Box>
    </LocalizationProvider>
  )
}

export default PaymentForm
