<template>
  <div class="modal-info-window">
    <div
      class="modal-wrapper"
      :class="{ active: true }"
      @click.self="$emit('close')"
    >
      <div
        class="modal-window"
        :style="{ width, height }"
      >
        <div
          v-for="(value, key) in infoModalDataTitles"
          :key="key"
        >
          {{ value }} : {{ !!data[key] ? data[key] : 'No data' }}
        </div>

        <Attachment
          :isTable="false"
          :data="inputData"
          :envAddress="envAddress"
        />

      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import Attachment from '../components/Attachment.vue';

export default {
  components: {
    Attachment
  },
  props: {
    width: {
      type: String,
      default: '318px'
    },
    height: {
      type: String,
      default: 'auto'
    },
    infoModalDataTitles: {
      type: Object
    },
    inputData: {
      type: Object
    }
  },
  setup(props) {
    const envAddress = ref(process.env.VUE_APP_FILE_LINK)

    console.log(Object.keys(props.inputData))
    console.log(Object.keys(props.infoModalDataTitles))
    console.log(
      Object.keys(props.inputData)
              .filter(item => Object.keys(props.infoModalDataTitles).includes(item))
    )

    const data = computed(() => {
      return Object.keys(props.inputData)
              .filter(item => Object.keys(props.infoModalDataTitles).includes(item))
              .reduce((acc, current) => {
                return {
                  ...acc,
                  [current] : props.inputData[current]
                }
              }, {})
    })

    return {
      data,
      envAddress
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/_colors.scss';

  .modal-info-window {
    .modal-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(0 0 0 / 53%);
      z-index: 10;
      display: none;
      justify-content: center;
      align-items: center;

      &.active {
        display: flex;
      }

      .modal-window {
        width: 500px;
        overflow-y: auto;
        padding: 20px;
        background: $bg-primary;

        .title {
          font-family: Dosis;
          font-style: normal;
          font-weight: bold;
          font-size: 20px;
          line-height: 24px;
          letter-spacing: 0.15px;
          color: $main-text;

          .name-of-request {
            display: flex;
            align-items: flex-start;
            font-family: Dosis;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0.25px;
            color: #666666;
            margin-top: 12px;

            .left {
              width: 27px;
            }
            .right {
              width: 216px;
            }
          }
        }



        .main-text {
          font-family: Dosis;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 140%;
          letter-spacing: 0.44px;
          color: $small-text;
        }

        .form-block select {
          border: 1px solid $main-grey;
          box-sizing: border-box;
          border-radius: 4px;
          width: 100%;
          padding: 16px 17px;
          margin-bottom: 40px;
        }

        .btn-block {
          display: flex;
          justify-content: flex-end;

          .black-btn {
            font-family: Dosis;
            font-style: normal;
            font-weight: bold;
            font-size: 18px;
            line-height: 23px;
            letter-spacing: 0.68px;
            text-transform: uppercase;
            color: $main-text;
            cursor: pointer;
            margin-right: 24px;
          }
          .green-btn {
            font-family: Dosis;
            font-style: normal;
            font-weight: bold;
            font-size: 18px;
            line-height: 23px;
            letter-spacing: 0.68px;
            text-transform: uppercase;
            color: $bg-green;
            cursor: pointer;
          }
        }
      }
    }
  }

</style>
