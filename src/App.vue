<template>
  <div class="main">
    <div class="swiper_wrap">
      <swiper
        :slides-per-view="1"
        :space-between="0"
        class="swiper_wrap"
        :modules="modules"
        :autoplay="{
          delay: 3000,
        }"
      >
        <swiper-slide v-for="item in imgList">
          <img
            loading="lazy"
            :src="item"
            style="
              background-color: whitesmoke;
              width: 100%;
              height: 40vh;
              border: none;
              object-fit: contain;
            "
          />
        </swiper-slide>
      </swiper>
    </div>
    <div
      style="
        background-color: whitesmoke;
        margin: 8px 0 0 0;
        padding: 4px 16px;
        color: black;
        font-size: 14px;
        font-weight: 600;
      "
    >
      <div
        style="
          color: #e13750;
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: 600;
        "
      >
        {{ getPrice }}
      </div>
      {{ goodInfo.name }}
    </div>
    <div
      v-if="goodInfo.remark"
      style="
        background-color: whitesmoke;
        margin: 0;
        padding: 4px 16px;
        color: grey;
        font-size: 14px;
      "
    >
      {{ goodInfo.remark }}dddd
    </div>
    <div style="margin-top: 8px">
      <template v-for="item in detailImgList">
        <img
          loading="lazy"
          :src="item"
          alt=""
          style="background-color: whitesmoke; width: 100%; border: none"
        />
      </template>
    </div>
    <div class="download_btn" @click="handleClick">{{ getAppText }}</div>
  </div>
</template>
<script setup>
import CallApp from "callapp-lib";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper";

import { ref, computed, onMounted, reactive } from "vue";
import "swiper/css";
const modules = ref([Autoplay]);
const callLib = new CallApp({
  scheme: {
    protocol: "pandamarket",
  },
});

function handleClick() {
  callLib.open({
    path: "",
    callback: () => {
      console.log("a");
    },
  });
}

const imgList = computed(() => {
  return goodInfo.value.pic_url || [];
});
const detailImgList = computed(() => {
  return goodInfo.value.detail || [];
});
const lang = ref("cn");

const TEXT_MAP = {
  cn: "APP?????????",
  italy: "Guarda nell???App",
};
const getAppText = computed(() => {
  return TEXT_MAP[lang.value];
});

const goodInfo = ref({});

const getPrice = computed(() => {
  let price = goodInfo.value.origin_price;
  if (goodInfo.value.goods_level === 0) {
    price = goodInfo.value.origin_price;
  } else if (goodInfo.value.goods_level === 1) {
    price = goodInfo.value.discount_price;
  } else if (goodInfo.value.goods_level === 2) {
    price = goodInfo.value.vip_price;
  }
  return "??? " + (!isNaN(price) ? (price / 100).toFixed(2) : "");
});

onMounted(() => {
  // cn/en/italy
  const search = window.location.search;
  const params = search.replace("?", "").split("&");
  const goodsParam = params[0] || "";
  const langParam = params[1] || "cn";
  const goods_id = goodsParam.split("=")[1] || "";
  lang.value = langParam.split("=")[1] || "cn";
  const instance = axios.create({
    timeout: 60 * 1000,
    headers: {
      lang: lang.value,
    },
  });
  instance
    .post("/v1/goods/info", {
      goods_id: +goods_id,
    })
    .then(function (rs) {
      console.log("sss", rs);
      goodInfo.value = rs.data;
    })
    .catch(function (error) {
      console.log("ee", error);
    });
});
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  /* background: #f7941e10; */
}
.main .download_btn {
  position: fixed;
  bottom: 30px;
  left: 50%;
  text-align: center;
  transform: translateX(-50%);
  border-radius: 30px;
  /* width: 150px; */
  padding: 8px 16px;
  /* height: 50px;
  line-height: 50px; */
  background-color: #e13750;
  color: white;
  box-shadow: 2px 2px 10px #00000080;
}
.main .swiper_wrap {
  height: 40vh;
}
</style>
