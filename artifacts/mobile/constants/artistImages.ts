const artistImages: Record<string, ReturnType<typeof require>> = {
  a1: require("@/assets/images/artists/artist_amara.png"),
  a2: require("@/assets/images/artists/artist_kwame.png"),
  a3: require("@/assets/images/artists/artist_zara.png"),
  a4: require("@/assets/images/artists/artist_seun.png"),
  a5: require("@/assets/images/artists/artist_fatima.png"),
};

export function getArtistImage(artistId: string): ReturnType<typeof require> | string {
  return artistImages[artistId] ?? "https://ui-avatars.com/api/?background=1E1E1E&color=D4AF37&size=200";
}
