import { ComponentCustomProperties } from "vue";
import { Store } from "vuex"; // path to store file
import { StoreState } from "./store";

declare module "@vue/runtime-core" {
  // type Identifier = {
  //   use: string;
  //   system: string;
  //   value: string;
  //   period: {
  //     start: string;
  //     end: string;
  //   };
  //   type: {
  //     coding: {
  //       system: string;
  //       version: string;
  //       code: string;
  //       display: string;
  //       userSelected: boolean;
  //     };
  //     text: string;
  //   };
  // };
  //
  // interface StoreType {
  //   questionnaire: { item: object };
  //   questionnaireImported: {
  //     identifier: Identifier[];
  //     url: string;
  //     name: string;
  //     version: string;
  //     title: string;
  //     status: "draft" | "active" | "retired" | "unknown";
  //     publisher: string;
  //     date: string;
  //     approvalDate: string;
  //     lastReviewDate: string;
  //     experimental: Boolean;
  //     item: object[];
  //     resourceType: string;
  //   };
  //   secondaryItemSelected: Object;
  //   fileImported: {
  //     name: string;
  //   };
  //   settings: {
  //     answers: {
  //       answersValueset: Boolean;
  //       openChoice: Boolean;
  //       choice: Boolean;
  //     };
  //   };
  // }

  interface ComponentCustomProperties {
    $store: Store<StoreState>;
  }
}
