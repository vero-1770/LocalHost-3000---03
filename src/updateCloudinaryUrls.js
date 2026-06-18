import { prisma }  from "./prisma/prismaClient.js";

const images = [
  {
    destinationId: 1,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360982/Lago_Nahuel_Huapi_Bariloche_Argentina_biuchs.jpg"
  },
  {
    destinationId: 2,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360982/One_of_my_favourite_a6dkdg.jpg"
  },
  {
    destinationId: 3,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360981/Why_Everyone_Is_Obsessed_With_the_Puerto_Rico_Aesthetic_Right_Now_udwe5i.jpg"
  },
  {
    destinationId: 4,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360981/The_Best_Of_Quito_in_a_Luxury_Trip_To_Ecuador_z1yke6.jpg"
  },
    {
    destinationId: 5,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360982/Useful_Data_in_the_City_of_Cusco_ga7v6s.jpg"
  },
    {
    destinationId: 6,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360981/Chile_Valpara%C3%ADso_color_wake_aahmzn.jpg"
  },
    {
    destinationId: 7,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360982/descarga_lptf9p.jpg"
  },
    {
    destinationId: 8,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360981/Cataratas_do_Igua%C3%A7u_ARG_a5xxyo.jpg"
  },
    {
    destinationId: 9,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360981/Playa_El_Agua_b4jqej.jpg"
  },
    {
    destinationId: 10,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781360981/El_yunque_rainforest_yoeya1.jpg"
  },
    {
    destinationId: 11,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361754/Galapagos_Islands___Ro_Ariass___Flickr_occixc.jpg"
  },
    {
    destinationId: 12,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361754/Machu_Picchu_jpi7dx.jpg"
  },
    {
    destinationId: 13,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361753/W_Trek_Torres_del_Paine_Patagonia_s_most_famous_hike_by_ChileTour_onem3a.jpg"
  },
    {
    destinationId: 14,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361754/Medell%C3%ADn_Colombia_on_Instagram__Por_qu%C3%A9_debes_visitar_Medell%C3%ADn__La_ciudad_de_la_eterna_primavera_vive_un_momento_incre%C3%ADble__Medell%C3%ADn_se_ha_sacudido_de_su_turbulenta_ebrvky.jpg"
  },
    {
    destinationId: 15,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361753/CAFAYATE_SALTA_ARGENTINA_hayeed.jpg"
  },
    {
    destinationId: 16,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361753/Exciting_adventures_in_an_impressive_natural_setting_vn0yob.jpg"
  },
    {
    destinationId: 17,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361753/Playa_Morrocoy_hw1fih.jpg"
  },
    {
    destinationId: 18,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361752/Isla_Vieques_xiol8r.jpg"
  },
    {
    destinationId: 19,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361752/Pailon_del_Diablo_s5z2vm.jpg"
  },
    {
    destinationId: 20,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781361752/Arequipa_Per%C3%BA_gxqf7v.jpg"
  },
    {
    destinationId: 21,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362659/Valle_de_la_Luna_San_Pedro_de_Atacama_Chile__Dream_Travel_2020__t7c97z.jpg"
  },
    {
    destinationId: 22,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362659/Bogot%C3%A1_silnxw.jpg"
  },
    {
    destinationId: 23,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362658/El_Calafate_egynu0.jpg"
  },
    {
    destinationId: 24,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362658/M%C3%A9rida_en_imagenes_on_Instagram__giovannydinuzzo_Patrona_de_los_monta%C3%B1istas_la_Virgen_de_las_nieves_ubicada_en_la_estaci%C3%B3n_Pico_Espejo_del_mukumbari_es_un_de_los_lwucub.jpg"
  },
    {
    destinationId: 25,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362657/Qu%C3%A9_hacer_en_San_Andr%C3%A9s_Colombia__Lugares_para_visitar_ojmkjq.jpg"
  },
    {
    destinationId: 26,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362657/Tilcara_Jujuy_xkjz77.jpg"
  },
    {
    destinationId: 27,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362656/Angel_Falls_Bolivar_State_Venezuela_jupcus.jpg"
  },
    {
    destinationId: 28,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362656/Angel_Falls_Bolivar_State_Venezuela_jupcus.jpg"
  },
    {
    destinationId: 29,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362656/Cascada_de_Peguche_Otovalo_Ecuador_Photo_Print_ugmm37.jpg"
  },
    {
    destinationId: 30,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781362655/Trujillo_Peru_lour2z.jpg"
  },
    {
    destinationId: 31,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368182/Visiter_Chilo%C3%A9_une_%C3%AEle_fig%C3%A9e_dans_le_temps_awsohr.jpg"
  },
    {
    destinationId: 32,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368181/Santa_Marta_Colombia_ljimqt.jpg"
  },
    {
    destinationId: 33,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368181/Villa_La_Angostura_Town_in_Argentina_q7vfcj.jpg"
  },
    {
    destinationId: 34,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368181/M%C3%A9danos_de_Coro_xvcgt2.jpg"
  },
    {
    destinationId: 35,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368180/descarga_cukhm4.jpg"
  },
    {
    destinationId: 36,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368180/My_beauty_city__Puerto_Madryn_in_the_south_of_Argentina_uposvw.jpg"
  },
    {
    destinationId: 37,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368180/Lugares_que_deber%C3%ADas_visitar____f4oszm.jpg"
  },
    {
    destinationId: 38,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368179/Marias_Beach_Rinc%C3%B3n_Puerto_Rico___BoricuaOnline_com_fhfgbt.jpg"
  },
    {
    destinationId: 39,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368179/Monta%C3%B1ita_cyycoj.jpg"
  },
    {
    destinationId: 40,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/V%C3%ADctor_M__Lozada_A._on_Instagram__%C3%9Altima_parada_en_el_roadtrip_por_el_norte_de_Peru___huanchaco_Trujillo_http___vimla_z6qnc6.jpg"
  },
    {
    destinationId: 41,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/car%C3%BApano_Estado_Sucre_Foto_Senderos_de_Sucre_zehb0h.jpg"
  },
    {
    destinationId: 42,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/Cuman%C3%A1_-_Casco_Hist%C3%B3rico_-_Callej%C3%B3n_El_Alacr%C3%A1n_dplheo.jpg"
  },
    {
    destinationId: 43,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/paseo_Orinoco_Ciudad_Bolivar_Venezuela_udz9gl.jpg"
  },
    {
    destinationId: 44,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/Maracaibo_lkyjex.jpg"
  },
    {
    destinationId: 45,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/Mirador_Monte_Bello_-_Puerto_Ayacucho_-_Edo_Amazonas_-_Venezuela_whafoj.jpg"
  },
    {
    destinationId: 46,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/Rosario_Argentina_h27g6p.jpg"
  },
    {
    destinationId: 47,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/San_Mart%C3%ADn_de_los_Andes_Patagonia_Argentina_vqmmif.jpg"
  },
    {
    destinationId: 48,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368178/Argentina__photographic_tourism_or8seq.jpg"
  },
    {
    destinationId: 49,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368177/Parque_Nacional_Ischigualasto_San_Juan__Argentina__hc1tum.jpg"
  },
    {
    destinationId: 50,
    url: "https://res.cloudinary.com/dnqhdr8jk/image/upload/v1781368177/Ushuaia_TDF_Argentina_gcl6p7.jpg"
  }
];


const updateImages = async () => {

  for (const img of images) {

    await prisma.image.updateMany({
      where: {
        destinationId: img.destinationId
      },
      data: {
        url: img.url
      }
    });
    
    console.log("Actualizada:", img.destinationId);
  }

  await prisma.$disconnect();
};


updateImages();