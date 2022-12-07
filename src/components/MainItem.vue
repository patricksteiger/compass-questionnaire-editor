<template>
  <div class="q-pa-md" style="width-min: 430px">
    <q-list class="rounded-borders">
      <q-expansion-item
        v-for="firstLevel in mainQuestions"
        :key="firstLevel.linkId"
        expand-separator
        :label="firstLevel.text"
        switch-toggle-side
        dense-toggle
        :header-style="{ paddingLeft: '0px' }"
        draggable="true"
        class="drop-target"
      >
        <!--  Firts Question Level -->
        <template v-slot:header>
          <!--  Question Text -->
          <q-item-section>
            <b>{{ firstLevel.text }}</b>
          </q-item-section>

          <!-- Question Tools -->
          <q-item-section side>
            <div class="row items-right">
              {{ firstLevel.linkId }}
              <q-icon name="restore" size="24px" />
              <q-toggle size="xs" v-model="firstLevel.__active"></q-toggle>
              <q-icon name="drag_handle" size="24px" />
            </div>
          </q-item-section>
        </template>

        <!--  Second Question Level -->
        <q-item
          v-for="secondLevel in firstLevel.item"
          :key="secondLevel.linkId"
          clickable
          @click="clickSecondItem(secondLevel)"
        >
          <!--  Question Text -->
          <q-item-section>
            <div class="row">
              <q-icon
                :name="secondLevel.__typeIcon"
                size="20px"
                style="margin-left: 20px; margin-right: 7px"
              />
              {{ secondLevel.text }}
            </div>
          </q-item-section>

          <!-- Question Tools -->
          <q-item-section side>
            <div class="row">
              {{ secondLevel.linkId }}
              <!-- Quesion Type -->
              <q-icon name="restore" size="24px" />
              <q-toggle size="xs" v-model="secondLevel.__active"></q-toggle>
              <q-icon name="drag_handle" size="24px" />
            </div>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { questionTypesIcons } from "../utils/constants";
import { mapMutations } from "vuex";
import { defineComponent } from "vue";

class Item {
  __active: boolean = true;
  __typeIcon: string = "";
  __icon: string = "";
  item: Item[] = [];
  linkId: string = "";
  text: string = "";
  type: number = -1;
}

export default defineComponent({
  name: 'MainItem',
  props: {
    // item: Object,
    item: Array<Item>,
  },
  methods: {
    ...mapMutations(["setSecondItemSelected"]),
    clickSecondItem(item: Item) {
      console.log(`clickSecondItem: ${item}`);
    },
  },
  computed: {
    mainQuestions() {
      if (!this.item) {
        return [];
      }
      return this.item.map((itemQ: Item) => {
        itemQ.__typeIcon = questionTypesIcons[itemQ.type].icon;
        itemQ.item.map((itemS) => {
          itemS.__typeIcon = questionTypesIcons[itemS.type].icon;
        });
        return itemQ;
      });
    },
    /* questionTypeIcon (){
      return questionTypesIcons["decimal"].icon;
    } */
  },
});
</script>
