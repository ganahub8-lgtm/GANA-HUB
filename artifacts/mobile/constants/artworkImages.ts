const artworkImages: Record<string, ReturnType<typeof require>> = {
  w1:  require("@/assets/images/artworks/painting_01_afro_face.jpg"),
  w2:  require("@/assets/images/artworks/painting_02_giraffe_drinking.jpg"),
  w3:  require("@/assets/images/artworks/painting_03_tribal_children.jpg"),
  w4:  require("@/assets/images/artworks/painting_04_girl_elephant.jpg"),
  w5:  require("@/assets/images/artworks/painting_05_chimp_dj.jpg"),
  w6:  require("@/assets/images/artworks/painting_06_elephant_bold.jpg"),
  w7:  require("@/assets/images/artworks/painting_07_joyful_women.jpg"),
  w8:  require("@/assets/images/artworks/painting_08_giraffe_pair.jpg"),
  w9:  require("@/assets/images/artworks/painting_09_three_chimps.jpg"),
  w10: require("@/assets/images/artworks/painting_10_maasai_woman_bw.jpg"),
  w11: require("@/assets/images/artworks/painting_11_abstract_man.jpg"),
  w12: require("@/assets/images/artworks/painting_12_maasai_girl_bw.jpg"),
  w13: require("@/assets/images/artworks/painting_13_woman_tulips.jpg"),
  w14: require("@/assets/images/artworks/painting_14_elephant_red.jpg"),
  w15: require("@/assets/images/artworks/painting_15_elephant_water.jpg"),
  w16: require("@/assets/images/artworks/painting_16_koi_fish.jpg"),
  w17: require("@/assets/images/artworks/painting_17_man_lion.jpg"),
  w18: require("@/assets/images/artworks/painting_18_orange_woman.jpg"),
  w19: require("@/assets/images/artworks/painting_19_elephant_family.jpg"),
  w20: require("@/assets/images/artworks/painting_20_lion_of_judah.jpg"),
};

export function getArtworkImage(id: string): ReturnType<typeof require> | string {
  return artworkImages[id] ?? "";
}
