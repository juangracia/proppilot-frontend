import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es') // Default to Spanish
  const [currency, setCurrency] = useState('ARS') // Default to Argentine Peso

  const translations = {
    es: {
      // Header
      appTitle: 'PropPilot',
      appSubtitle: 'Gestión de Propiedades de Alquiler',
      
      // Tabs
      propertyUnits: 'UNIDADES DE PROPIEDAD',
      registerPayment: 'REGISTRAR PAGO',
      
      // Property List
      propertyUnitsTitle: 'Unidades de Propiedad',
      addProperty: 'AGREGAR PROPIEDAD',
      searchPlaceholder: 'Buscar por dirección...',
      
      // Table Headers
      id: 'ID',
      address: 'Dirección',
      type: 'Tipo',
      baseRent: 'Alquiler Base',
      leaseStart: 'Inicio Contrato',
      tenant: 'Inquilino',
      noTenant: 'Sin Inquilino',
      
      // Property Types
      apartment: 'Departamento',
      house: 'Casa',
      duplex: 'Duplex',
      ph: 'PH (Propiedad Horizontal)',
      studio: 'Estudio',
      loft: 'Loft',
      townhouse: 'Casa Adosada',
      
      // Add Property Dialog
      addNewProperty: 'Agregar Nueva Propiedad',
      addressLabel: 'Dirección',
      addressPlaceholder: 'Ej: Calle Principal 1234, Barrio Centro',
      addressHelper: 'Dirección completa de la propiedad',
      propertyTypeLabel: 'Tipo de Propiedad',
      selectPropertyType: 'Seleccionar tipo de propiedad',
      baseRentLabel: 'Alquiler Base',
      baseRentPlaceholder: 'Ej: 85000',
      baseRentHelper: 'Monto mensual',
      leaseStartLabel: 'Fecha de Inicio del Contrato',
      leaseStartHelper: 'Fecha de inicio del contrato de alquiler',
      
      // Dialog Actions
      cancel: 'CANCELAR',
      addPropertyAction: 'AGREGAR PROPIEDAD',
      
      // Messages
      totalUnits: 'Total: {count} unidade{plural} de propiedad',
      loading: 'Cargando...',
      errorOccurred: 'Ocurrió un error',
      
      // Payment Form
      registerPaymentTitle: 'Registrar Pago',
      propertyUnitLabel: 'Unidad de Propiedad',
      paymentAmountLabel: 'Monto del Pago',
      paymentDateLabel: 'Fecha de Pago',
      paymentTypeLabel: 'Tipo de Pago',
      descriptionLabel: 'Descripción (Opcional)',
      clearForm: 'Limpiar Formulario',
      registerPaymentAction: 'Registrar Pago',
      selectedPropertyDetails: 'Detalles de la Propiedad Seleccionada:',
      paymentRegisteredSuccess: '¡Pago registrado exitosamente!',
      failedToRegisterPayment: 'Error al registrar el pago',
      fixValidationErrors: 'Por favor corrige los errores de validación',
      charactersCount: '{count}/500 caracteres',
      
      // Payment Types
      rentPayment: 'Pago de Alquiler',
      depositPayment: 'Depósito',
      maintenancePayment: 'Mantenimiento',
      utilityPayment: 'Servicios',
      otherPayment: 'Otro',
      
      // Currencies
      currencySymbol: {
        ARS: '$',
        USD: 'US$'
      },
      currencyName: {
        ARS: 'Pesos Argentinos',
        USD: 'Dólares Estadounidenses'
      }
    },
    en: {
      // Header
      appTitle: 'PropPilot',
      appSubtitle: 'Rental Property Management',
      
      // Tabs
      propertyUnits: 'PROPERTY UNITS',
      registerPayment: 'REGISTER PAYMENT',
      
      // Property List
      propertyUnitsTitle: 'Property Units',
      addProperty: 'ADD PROPERTY',
      searchPlaceholder: 'Search by address...',
      
      // Table Headers
      id: 'ID',
      address: 'Address',
      type: 'Type',
      baseRent: 'Base Rent',
      leaseStart: 'Lease Start',
      tenant: 'Tenant',
      noTenant: 'No Tenant',
      
      // Property Types
      apartment: 'Apartment',
      house: 'House',
      duplex: 'Duplex',
      ph: 'Townhouse',
      studio: 'Studio',
      loft: 'Loft',
      townhouse: 'Townhouse',
      
      // Add Property Dialog
      addNewProperty: 'Add New Property',
      addressLabel: 'Address',
      addressPlaceholder: 'Ex: 123 Main Street, Downtown',
      addressHelper: 'Complete property address',
      propertyTypeLabel: 'Property Type',
      selectPropertyType: 'Select property type',
      baseRentLabel: 'Base Rent',
      baseRentPlaceholder: 'Ex: 1500',
      baseRentHelper: 'Monthly amount',
      leaseStartLabel: 'Lease Start Date',
      leaseStartHelper: 'Lease contract start date',
      
      // Dialog Actions
      cancel: 'CANCEL',
      addPropertyAction: 'ADD PROPERTY',
      
      // Messages
      totalUnits: 'Total: {count} property unit{plural}',
      loading: 'Loading...',
      errorOccurred: 'An error occurred',
      
      // Payment Form
      registerPaymentTitle: 'Register Payment',
      propertyUnitLabel: 'Property Unit',
      paymentAmountLabel: 'Payment Amount',
      paymentDateLabel: 'Payment Date',
      paymentTypeLabel: 'Payment Type',
      descriptionLabel: 'Description (Optional)',
      clearForm: 'Clear Form',
      registerPaymentAction: 'Register Payment',
      selectedPropertyDetails: 'Selected Property Details:',
      paymentRegisteredSuccess: 'Payment registered successfully!',
      failedToRegisterPayment: 'Failed to register payment',
      fixValidationErrors: 'Please fix the validation errors below',
      charactersCount: '{count}/500 characters',
      
      // Payment Types
      rentPayment: 'Rent Payment',
      depositPayment: 'Deposit',
      maintenancePayment: 'Maintenance',
      utilityPayment: 'Utility',
      otherPayment: 'Other',
      
      // Currencies
      currencySymbol: {
        ARS: 'AR$',
        USD: '$'
      },
      currencyName: {
        ARS: 'Argentine Pesos',
        USD: 'US Dollars'
      }
    }
  }

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
    }
    
    return value || key
  }

  const formatCurrency = (amount, currencyCode = currency) => {
    const symbol = t(`currencySymbol.${currencyCode}`)
    const formattedAmount = new Intl.NumberFormat(language === 'es' ? 'es-AR' : 'en-US').format(amount)
    return `${symbol}${formattedAmount}`
  }

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    formatCurrency,
    availableLanguages: [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' }
    ],
    availableCurrencies: [
      { code: 'ARS', name: t('currencyName.ARS') },
      { code: 'USD', name: t('currencyName.USD') }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
