

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    github: string
    dateOfBirth: Date,
    nationality: string
    online: boolean
}

export interface Country {
    code: string,
    name: string,
    flag: string,
}

export default class DataStore {
    
    private users = [{
        id: '1',
        firstName: 'john',
        lastName: 'doe',
        github: 'johndoe',
        dateOfBirth: new Date(),
        nationality: 'NL',
        online: true
    }] as User[]

    private countries = [
        { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
        { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
        { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
        { code: 'US', name: 'United States', flag: '🇺🇲' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'IL', name: 'Israel', flag: '🇮🇱' },
        { code: 'NO', name: 'Norway', flag: '🇳🇴' },
        { code: 'IT', name: 'Italy', flag: '🇮🇹' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦' },
        { code: 'CG', name: 'Congo', flag: '🇨🇬' },
        { code: 'CL', name: 'Chile', flag: '🇨🇱' },
        { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'GR', name: 'Greece', flag: '🇬🇷' },
        { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
        { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
        { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
        { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
        { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
        { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
        { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
        { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
        { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
        { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
    ]

    GetUsers(): User[] {
        return this.users
    }

    DeleteUsers(ids: string[]) {
     this.users = this.GetUsers().filter(u => !ids.includes(u.id))   
    }

    GetCountries(): Country[] {
        return this.countries
    }
    GetCountry(countryCode: string): Country {
        return this.countries.filter(c => c.code == countryCode)[0]
    }

}