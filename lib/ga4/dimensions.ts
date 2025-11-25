// Comprehensive GA4 Dimensions List
// Source: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

export interface GA4Dimension {
  name: string
  label: string
  description: string
  category: string
}

export const GA4_DIMENSIONS: GA4Dimension[] = [
  // Time Dimensions
  {
    name: 'date',
    label: 'Date',
    description: 'The date of the session, in YYYYMMDD format',
    category: 'Time',
  },
  {
    name: 'year',
    label: 'Year',
    description: 'The year the session started',
    category: 'Time',
  },
  {
    name: 'month',
    label: 'Month',
    description: 'The month the session started',
    category: 'Time',
  },
  {
    name: 'week',
    label: 'Week',
    description: 'The week the session started',
    category: 'Time',
  },
  {
    name: 'day',
    label: 'Day',
    description: 'The day of the month the session started',
    category: 'Time',
  },
  {
    name: 'hour',
    label: 'Hour',
    description: 'The hour the session started',
    category: 'Time',
  },

  // Traffic Source Dimensions
  {
    name: 'sessionSource',
    label: 'Session Source',
    description: 'The source of traffic to your property',
    category: 'Traffic Source',
  },
  {
    name: 'sessionMedium',
    label: 'Session Medium',
    description: 'The medium that acquired users to your property',
    category: 'Traffic Source',
  },
  {
    name: 'sessionCampaign',
    label: 'Session Campaign',
    description: 'The campaign that acquired users to your property',
    category: 'Traffic Source',
  },
  {
    name: 'source',
    label: 'Source',
    description: 'The source of traffic',
    category: 'Traffic Source',
  },
  {
    name: 'medium',
    label: 'Medium',
    description: 'The medium that acquired users',
    category: 'Traffic Source',
  },
  {
    name: 'campaign',
    label: 'Campaign',
    description: 'The campaign name',
    category: 'Traffic Source',
  },
  {
    name: 'firstUserSource',
    label: 'First User Source',
    description: 'The source that first acquired the user',
    category: 'Traffic Source',
  },
  {
    name: 'firstUserMedium',
    label: 'First User Medium',
    description: 'The medium that first acquired the user',
    category: 'Traffic Source',
  },
  {
    name: 'firstUserCampaign',
    label: 'First User Campaign',
    description: 'The campaign that first acquired the user',
    category: 'Traffic Source',
  },

  // Geographic Dimensions
  {
    name: 'country',
    label: 'Country',
    description: 'The country from which sessions were initiated',
    category: 'Geography',
  },
  {
    name: 'region',
    label: 'Region',
    description: 'The geographic region from which sessions were initiated',
    category: 'Geography',
  },
  {
    name: 'city',
    label: 'City',
    description: 'The city from which sessions were initiated',
    category: 'Geography',
  },
  {
    name: 'continent',
    label: 'Continent',
    description: 'The continent from which sessions were initiated',
    category: 'Geography',
  },
  {
    name: 'subContinent',
    label: 'Sub Continent',
    description: 'The sub-continent from which sessions were initiated',
    category: 'Geography',
  },

  // Technology Dimensions
  {
    name: 'deviceCategory',
    label: 'Device Category',
    description: 'The type of device: desktop, tablet, or mobile',
    category: 'Technology',
  },
  {
    name: 'mobileDeviceInfo',
    label: 'Mobile Device Info',
    description: 'The mobile device branding, model, and marketing name',
    category: 'Technology',
  },
  {
    name: 'operatingSystem',
    label: 'Operating System',
    description: 'The operating system used by users',
    category: 'Technology',
  },
  {
    name: 'operatingSystemVersion',
    label: 'OS Version',
    description: 'The version of the operating system',
    category: 'Technology',
  },
  {
    name: 'browser',
    label: 'Browser',
    description: 'The browser used by users',
    category: 'Technology',
  },
  {
    name: 'browserVersion',
    label: 'Browser Version',
    description: 'The version of the browser',
    category: 'Technology',
  },

  // Content Dimensions
  {
    name: 'pagePath',
    label: 'Page Path',
    description: 'The path portion of the URL',
    category: 'Content',
  },
  {
    name: 'pageTitle',
    label: 'Page Title',
    description: 'The title of the page',
    category: 'Content',
  },
  {
    name: 'pageLocation',
    label: 'Page Location',
    description: 'The full URL of the page',
    category: 'Content',
  },
  {
    name: 'hostName',
    label: 'Hostname',
    description: 'The hostname from which the tracking request was made',
    category: 'Content',
  },
  {
    name: 'landingPage',
    label: 'Landing Page',
    description: 'The first page in users\' sessions',
    category: 'Content',
  },
  {
    name: 'exitPage',
    label: 'Exit Page',
    description: 'The last page in users\' sessions',
    category: 'Content',
  },

  // User Dimensions
  {
    name: 'userId',
    label: 'User ID',
    description: 'The user ID set via the setUserId API',
    category: 'User',
  },
  {
    name: 'userAgeBracket',
    label: 'User Age Bracket',
    description: 'The age bracket of the user',
    category: 'User',
  },
  {
    name: 'userGender',
    label: 'User Gender',
    description: 'The gender of the user',
    category: 'User',
  },
  {
    name: 'interestOtherCategory',
    label: 'Interest Other Category',
    description: 'Other categories of interest',
    category: 'User',
  },
]

export const GA4_DIMENSIONS_BY_CATEGORY = GA4_DIMENSIONS.reduce((acc, dimension) => {
  if (!acc[dimension.category]) {
    acc[dimension.category] = []
  }
  acc[dimension.category].push(dimension)
  return acc
}, {} as Record<string, GA4Dimension[]>)

export function getDimensionByName(name: string): GA4Dimension | undefined {
  return GA4_DIMENSIONS.find(d => d.name === name)
}

export function searchDimensions(query: string): GA4Dimension[] {
  const lowerQuery = query.toLowerCase()
  return GA4_DIMENSIONS.filter(
    dimension =>
      dimension.name.toLowerCase().includes(lowerQuery) ||
      dimension.label.toLowerCase().includes(lowerQuery) ||
      dimension.description.toLowerCase().includes(lowerQuery)
  )
}

