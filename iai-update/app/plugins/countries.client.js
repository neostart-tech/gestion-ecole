import countries from '~/utils/countries'

export default defineNuxtPlugin(() => {
  // Trier les pays par nom
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name))
  
  // Ajouter "Autre" en option à la fin
  const countriesWithOther = [
    ...sortedCountries,
    {
      name: 'Autre',
      code: 'OTHER',
      flagCode: 'unknown'
    }
  ]
  
  return {
    provide: {
      countries: countriesWithOther,
      getCountryByName: (name) => countriesWithOther.find(c => c.name === name),
      getCountryByCode: (code) => countriesWithOther.find(c => c.code === code)
    }
  }
})