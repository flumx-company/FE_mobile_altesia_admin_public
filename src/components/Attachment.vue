<template>
  <div class="attached-files">

    <div v-if="isTable" class="table-attachment">
      <div
        class="event-img"
        v-if="
          data.attachmentFiles &&
          data.attachmentFiles.length
        "
      >
        <div v-if="data.attachmentFiles.length > 1">
          <div class="show-image" v-if="data.attachmentFiles[0].mineType === 'image/jpeg'">
            <img :src="`${envAddress}${data.attachmentFiles[0].path}`" alt="">
          </div>
          <div class="show-file" v-else>
            <!-- <a :href="`${envAddress}${data.attachmentFiles[0].path}`" download>4 -->
              <img src="../assets/images/attached-file.svg" alt="">
              <span class="file-name">
                {{data.attachmentFiles[0].originalName.slice(0, data.attachmentFiles[0].originalName.indexOf('.'))}}
              </span>
              <span class="file-extantion">
                {{data.attachmentFiles[0].originalName.slice(data.attachmentFiles[0].originalName.indexOf('.'))}}
              </span>
            <!-- </a> -->
          </div>
          <div>
            + {{data.attachmentFiles.length - 1}} {{ data.attachmentFiles.length - 1 > 1 ? 'files' : 'file' }}
          </div>
        </div>
        <div v-else class="show-image">
          <img :src="`${envAddress}${data.attachmentFiles[0].path}`" alt="">
        </div>
      </div>

      <div v-else>No file attached</div>
    </div>

    <div v-else class="modal-attachment">
      <div
        class="event-img"
        v-if="
          data.attachmentFiles &&
          data.attachmentFiles.length
        "
      >
        <!-- <img
          v-for="file of data.attachmentFiles"
          :key="file.path"
          :src="`${envAddress}${file.path}`" 
          alt=""
        > -->

        <div 
          v-for="file of data.attachmentFiles"
          :key="file.path"
        >


          <div class="show-image" v-if="file.mineType === 'image/jpeg'">
            <a :href="`${envAddress}${file.path}`" download>
              <img :src="`${envAddress}${file.path}`" alt="">
            </a>
          </div>
          <div class="show-file" v-else>
            <a :href="`${envAddress}${file.path}`" download>
              <img src="../assets/images/attached-file.svg" alt="">
              <div class="file-title">
                <span class="file-name">
                  {{file.originalName.slice(0, file.originalName.indexOf('.'))}}
                </span>
                <span class="file-extantion">
                  {{file.originalName.slice(file.originalName.indexOf('.'))}}
                </span>
              </div>
            </a>
          </div>


        </div>






      </div>
      <div v-else>No file attached</div>
    </div>
    
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Attachment',
  props: {
    isTable: {
      type: Boolean
    },
    data: {
      type: Object
    },
    envAddress: {
      type: String
    }
  },
  setup(props) {
    console.log(props.isTable)
    console.log(props.data)
    // const data = computed(() => {
    //   if (props.dataRaw.id === 82 ) {
    //     const newObj = {...Object.defineProperties({}, Object.getOwnPropertyDescriptors(props.dataRaw.attachmentFiles[0]))}
    //     return {
    //       ...props.dataRaw,
    //       attachmentFiles: [
    //         props.dataRaw.attachmentFiles[0],
    //         newObj
    //       ]
    //     }
    //   } else {
    //     return props.dataRaw
    //   }
    // })
    return {
      // data
    }
  }
}
</script>

<style lang="scss" scoped>
  .attached-files {
    .table-attachment {
      .event-img {
        .show-image {
          img {
            width: 100%;
          }
        }
      }
    }
    .modal-attachment {
      .event-img {
        margin-top: 10px;
        display: flex;
        align-items: center;

        img {
          width: 100px;
        }

        .file-title {
          text-align: center;
        }
      }
    }
  }
</style>