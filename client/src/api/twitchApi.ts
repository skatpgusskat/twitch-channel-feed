export const TWITCH_APP_CLIENT_ID = '04x1w8j9ieyvxl4c3j17173z0zh1e7';

declare interface UserEmotesResponse {
  [EmoteSetId: string]: Array<{
    code: string,
    id: number,
  }>;
}

export async function getUserEmotes(accessToken: string, userId: string): Promise<UserEmotesResponse> {
  const response = await fetch(`https://api.twitch.tv/kraken/users/${userId}/emotes`, {
    headers: {
      'Authorization': `OAuth ${accessToken}`,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_APP_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json.emoticon_sets;
}

export async function getUser(accessToken: string) {
  const response = await fetch('https://api.twitch.tv/kraken/user', {
    headers: {
      'Authorization': `OAuth ${accessToken}`,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_APP_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json;
}

export async function getChannel(userId: string) {
  // TODO 캐싱할 것
  const response = await fetch(`https://api.twitch.tv/kraken/channels/${userId}`, {
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': TWITCH_APP_CLIENT_ID,
    },
  });
  const json = await response.json();
  return json;
}

export async function getProfilePicture(userId: string) {
  const channel = await getChannel(userId);
  return channel.logo;
}

export async function getUsername(userId: string) {
  const channel = await getChannel(userId);
  return channel.display_name;
}
