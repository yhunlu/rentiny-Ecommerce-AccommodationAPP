import { google } from 'googleapis';
import { Client, AddressComponent } from '@googlemaps/google-maps-services-js';

const oAuth2Client = new google.auth.OAuth2(
  `${process.env.GOOGLE_CLIENT_ID}`,
  `${process.env.GOOGLE_CLIENT_SECRET}`,
  `${process.env.GOOGLE_REDIRECT_URL}`
);

const maps = new Client({});

const parseAddress = (addressComponents: AddressComponent[]) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types[0] === 'country') {
      country = component.long_name;
    }

    if (component.types[0] === 'administrative_area_level_1') {
      admin = component.long_name;
    }

    if (
      component.types[0] === 'locality' ||
      component.types[0] === 'postal_town'
    ) {
      city = component.long_name;
    }
  }

  return { country, admin, city };
};

export const Google = {
  authUrl: oAuth2Client.generateAuthUrl({
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  }),
  logIn: async (code: string) => {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const { data } = await google
      .people({ version: 'v1', auth: oAuth2Client })
      .people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
      });

    return {
      user: data,
    };
  },
  geocode: async (address: string) => {
    const res = await maps.geocode({
      params: {
        address,
        key: `${process.env.GOOGLE_MAPS_API_KEY}`,
      },
      timeout: 1000, // milliseconds
    });

    if (res.status < 200 || res.status > 299) {
      throw new Error(res.data.error_message);
    }

    return parseAddress(res.data.results[0].address_components);
  },
};
