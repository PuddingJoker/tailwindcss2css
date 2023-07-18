<template >
  <div :class="`w-full h-full flex justify-center items-center bg`">
    <div class="p-[20px] w-[44rem] text-center">
      <h4 class="mb-[20px]">套餐购买</h4>
      <div
        class="list bg-[#fff] opacity-[.7]"
        style="
          border-bottom-right-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          border-bottom: none !important;
        "
      >
        <div class="list-item">
          <div class="settings-title">
            <div>支付方式</div>
          </div>
          <select
            :value="payWay"
            @change="e => setPayWay((e.target as any).value as any)"
          >
            <option v-for="(v, i) in payWays" :value="i" :key="i">
              {{ v }}
            </option>
          </select>
        </div>
      </div>
      <div
        class="list mb-[25px] bg-[#fff] opacity-[.7]"
        style="
          border-top-right-radius: 0 !important;
          border-top-left-radius: 0 !important;
        "
      >
        <div class="list-item">
          <div class="settings-title">
            <div>套餐选择</div>
          </div>
          <select
            :value="priceList"
            @change="e => setPriceList((e.target as any).value as any)"
          >
            <option v-for="(v, i) in priceLists" :value="i" :key="i">
              {{ v }}
            </option>
          </select>
        </div>
      </div>

      <NButton
        type="info"
        size="large"
        @click="submit"
        :disabled="btnDisable"
        :loading="btnDisable"
      >
        确认
      </NButton>
      <NButton
        style="margin-left: 20px !important"
        type="success"
        size="large"
        @click="jump"
        :disabled="showLoading"
        :loading="showLoading"
      >
        返回
      </NButton>
    </div>
  </div>
</template>


<script lang="ts">
import { ref } from "vue";
import { reactive } from "vue";
import { NButton } from "naive-ui";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { onUnmounted } from "vue";

export default defineComponent({
  setup() {
    const payWays = reactive(["支付宝"]);
    const showLoading = ref(false);
    const priceLists = reactive([
      "1￥/50次",
      "5￥/300次",
      "30￥/2000次",
      "5.99￥/1个月",
      "35￥/6个月（推荐）",
      "69￥/一年",
    ]);
    const payWay = ref(0);
    const setPayWay = (v: number) => (payWay.value = v);

    const priceList = ref(0);
    const setPriceList = (v: number) => (priceList.value = v);

    const router = useRouter();

    function isMobileScreen() {
      return window.innerWidth <= 600;
    }

    const btnDisable = ref(false);
    const submit = async () => {
      if (btnDisable.value == true) return;
      btnDisable.value = true;
      const isMobile = isMobileScreen();
      let token: any;
      if (isMobileScreen()) token = window.localStorage.getItem("mToken");
      try {
        let res: any = await fetch("https://api.pb519.cn/api/alipay", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceList: priceList.value,
            isMobile,
            date: Date.now(),
            token,
          }),
        });
        res = await res.json();
        if (res.code == 0 || res?.data?.code === 0) {
          return (window.location.href = res?.data?.data);
        } else {
          alert(
            res?.data?.message ||
              res?.message?.message ||
              "服务器繁忙，请稍后再试，有问题请联系作者邮箱"
          );
          router.push("/login");
        }
      } catch (error) {
        btnDisable.value = false;
        showLoading.value = false;
        alert("服务器繁忙，请稍后再试，有问题请联系作者邮箱");
      }
    };

    const jump = () => {
      showLoading.value = true;
      router.push("/chat");
    };

    onUnmounted(() => {
      btnDisable.value = false;
      showLoading.value = false;
    });

    return {
      payWays,
      priceLists,
      payWay,
      setPayWay,
      priceList,
      setPriceList,
      jump,
      submit,
      btnDisable,
      showLoading,
    };
  },
  components: {
    NButton,
  },
});
</script>


<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes slide-in-from-top {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
.list {
  border: 1px solid rgb(222, 222, 222);
  border-radius: 10px;
  box-shadow: 0px 2px 4px 0px rgb(0, 0, 0, 0.05);
  animation: slide-in ease 0.3s;
}

.list .list-item:last-child {
  border: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
  border-bottom: 1px solid rgb(222, 222, 222);
  padding: 10px 20px;
  animation: slide-in ease 0.6s;
}

.settings {
  padding: 20px;
  overflow: auto;
}

.settings-title {
  font-size: 14px;
  font-weight: bolder;
}

.settings-sub-title {
  font-size: 12px;
  font-weight: normal;
}
.bg {
  height: 100%;
  background-image: url(https://image-c-dev.weimobwmc.com/qa-fe-website/3e98b38bef8345a8b80542e91a0d09c3.jpg);
  background-attachment: fixed;
  background-size: cover;
}
</style>
