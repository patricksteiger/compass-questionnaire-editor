export const geccoQuestionnaire = {
  resourceType: "Questionnaire",
  url: "https://num-compass.science/fhir/Questionnaires/GECCO",
  version: "1.0",
  status: "active",
  item: [
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "anamnesis",
          },
        },
      ],
      linkId: "1",
      text: "Anamnese / Risikofaktoren",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasChronicLungDiseases",
              },
            },
          ],
          linkId: "1.1",
          text: "Leidet der/die Patient*in unter einer chronischen Lungenerkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.chronicLungDiseases",
              },
            },
          ],
          linkId: "1.2",
          text: "An welcher chronischen Lungenerkrankung leidet der/die Patient*in?",
          type: "group",
          enableWhen: [
            {
              question: "1.1",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.asthma",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.1",
              text: "Asthma",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.copd",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.2",
              text: "COPD",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.fibrosis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.3",
              text: "Lungenfibrose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.pulmonaryHypertension",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.4",
              text: "Lungenhochdruck/pulmonale Hypertonie",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.ohs",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.5",
              text: "OHS",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.sleepApnea",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.6",
              text: "Schlafapnoe",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.osas",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.7",
              text: "OSAS",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLungDiseases.cysticFibrosis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-lung-diseases",
                },
              ],
              linkId: "1.2.8",
              text: "Cystische Fibrose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasCardiovascularDiseases",
              },
            },
          ],
          linkId: "1.3",
          text: "Leidet der/die Patient*in unter einer Herz-Kreislauf-Erkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.cardiovascularDiseases",
              },
            },
          ],
          linkId: "1.4",
          text: "An welcher Herz-Kreislauf-Erkrankung leidet der/die Patient*in?",
          type: "group",
          enableWhen: [
            {
              question: "1.3",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.arterialHyptertension",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.1",
              text: "Bluthochdruck",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.stateAfterHeartAttack",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.2",
              text: "Zustand nach Herzinfarkt",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.cardiacArrhytmia",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.3",
              text: "Herzrhythmusstörungen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.heartFailure",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.4",
              text: "Herzinsuffizienz",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.peripherialArterialOcclusiveDisease",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.5",
              text: "pAVK",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.stateAfterRevascularization",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.6",
              text: "Zustand nach Revaskularisation",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.coronaryArteriosclerosis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.7",
              text: "Koronare Herzerkrankung (KHK)",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.cardiovascularDiseases.carotidArteryStenosis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/cardiovascular-diseases",
                },
              ],
              linkId: "1.4.8",
              text: "Carotisstenose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasChronicLiverDiseases",
              },
            },
          ],
          linkId: "1.5",
          text: "Leidet der/die Patient*in an einer chronischen Lebererkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.chronicLiverDiseases",
              },
            },
          ],
          linkId: "1.6",
          text: "An welcher chronischen Lebererkrankung leidet der/die Patient*in?",
          type: "group",
          enableWhen: [
            {
              question: "1.5",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLiverDiseases.steatosisOfLiver",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-liver-diseases",
                },
              ],
              linkId: "1.6.1",
              text: "Fettleber",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLiverDiseases.cirrhosisOfLiver",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-liver-diseases",
                },
              ],
              linkId: "1.6.2",
              text: "Leberzirrhose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLiverDiseases.chronicViralHepatitis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-liver-diseases",
                },
              ],
              linkId: "1.6.3",
              text: "Chronische infektiöse Hepatitis",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicLiverDiseases.autoimmuneLiverDisease",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-liver-diseases",
                },
              ],
              linkId: "1.6.4",
              text: "Autoimmune Lebererkrankungen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasRheumatologicalImmunologicalDiseases",
              },
            },
          ],
          linkId: "1.7",
          text: "Leidet der/die Patient*in unter mind. einer rheumatologischen/immunologischen Erkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.rheumatologicalImmunologicalDiseases",
              },
            },
          ],
          linkId: "1.8",
          text: "An welcher rheumatologischen/immunologischen Erkrankung leidet der/die Patient*in?",
          type: "group",
          enableWhen: [
            {
              question: "1.7",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.rheumatologicalImmunologicalDiseases.inflammatoryBowelDisease",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/rheumatological-immunological-diseases",
                },
              ],
              linkId: "1.8.1",
              text: "Chronisch entzündl. Darmerkrankung",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.rheumatologicalImmunologicalDiseases.rheumatoidArthritis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/rheumatological-immunological-diseases",
                },
              ],
              linkId: "1.8.2",
              text: "Rheumatoide Arthritis",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.rheumatologicalImmunologicalDiseases.collagenosis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/rheumatological-immunological-diseases",
                },
              ],
              linkId: "1.8.3",
              text: "Kollagenosen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.rheumatologicalImmunologicalDiseases.vasculitis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/rheumatological-immunological-diseases",
                },
              ],
              linkId: "1.8.4",
              text: "Vaskulitiden",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.rheumatologicalImmunologicalDiseases.congenitalImmunodeficiencyDisease",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/rheumatological-immunological-diseases",
                },
              ],
              linkId: "1.8.5",
              text: "angeborene Immundefekte",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasHivInfection",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/human-immunodeficiency-virus-infection",
            },
          ],
          linkId: "1.9",
          text: "Ist der/die Patient*in HIV-infiziert?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasHistoryOfBeingATissueOrOrganRecipient",
              },
            },
          ],
          linkId: "1.10",
          text: "Ist der/die Patient*in organtransplantiert?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.historyOfBeingATissueOrOrganRecipient",
              },
            },
          ],
          linkId: "1.11",
          text: "Welche Transplantation wurde durchgeführt?",
          type: "group",
          enableWhen: [
            {
              question: "1.10",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireHeart",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.1",
              text: "Herz",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireLung",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.2",
              text: "Lunge",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireLiver",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.3",
              text: "Leber",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireKidney",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.4",
              text: "Niere",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entirePancreas",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.5",
              text: "Bauchspeicheldrüse",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.intestinalStructure",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.6",
              text: "Darmstruktur",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireSmallIntestine",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.7",
              text: "gesamter Dünndarm",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireLargeIntestine",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.8",
              text: "gesamter Dickdarm",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.skinPart",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.9",
              text: "Haut",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireCornea",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.10",
              text: "Hornhaut",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.earOssicleStructure",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.11",
              text: "Gehörknöchelchen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.entireHeartValve",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.12",
              text: "Herzklappen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.bloodVesselPart",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.13",
              text: "Blutgefäß",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.cerebralMeningitisStructure",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.14",
              text: "Hirnhaut",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.boneTissueOrStructure",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.15",
              text: "Knochengewebe",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.cartilageTissue",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.16",
              text: "Knorpelgewebe",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfBeingATissueOrOrganRecipient.tendonStructure",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/organ-recipient",
                },
              ],
              linkId: "1.11.17",
              text: "Sehne",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasDiabetesMellitus",
              },
            },
          ],
          linkId: "1.12",
          text: "Leidet der/die Patient*in an Diabetes?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.diabetesMellitus",
              },
            },
          ],
          linkId: "1.13",
          text: "An welchem Typ Diabetes leidet der/die Patient*in?",
          type: "choice",
          enableWhen: [
            {
              question: "1.12",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "46635009",
                display: "Diabetes mellitus type 1 (disorder)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "44054006",
                display: "Diabetes mellitus type 2 (disorder)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "237599002",
                display: "Insulin treated type 2 diabetes mellitus (disorder)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "8801005",
                display: "Secondary diabetes mellitus (disorder)",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.malignantNeoplasticDiseases",
              },
            },
          ],
          linkId: "1.14",
          text: "Leidet der/die Patient*in unter mind. einer aktiven Tumor-/Krebserkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
                display: "Aktiv",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "remission",
                display: "In Remission",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "No",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "unknown",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.tobaccoSmokingStatus",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/smoking-status",
            },
          ],
          linkId: "1.15",
          text: "Hat der/die Patient*in jemals Zigaretten geraucht?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA18976-3",
                display: "Current every day smoker",
              },
            },
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA15920-4",
                display: "Former smoker",
              },
            },
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA18978-9",
                display: "Never smoker",
              },
            },
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA18980-5",
                display: "Unknown if ever smoked",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasChronicNeurologicalOrMentalDiseases",
              },
            },
          ],
          linkId: "1.16",
          text: "Leidet der/die Patient*in unter mind. einer chronischen neurologischen oder psychatrischen Erkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.chronicNeurologicalOrMentalDiseases",
              },
            },
          ],
          linkId: "1.17",
          text: "An welcher chronischen neurologischen oder psychatrischen Erkrankung leidet der/die Patient*in?",
          type: "group",
          enableWhen: [
            {
              question: "1.16",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.anxietyDisorder",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.1",
              text: "Angsterkrankung",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.depressiveDisorder",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.2",
              text: "Depression",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.psychoticDisorder",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.3",
              text: "Psychose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.parkinsonDisorder",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.4",
              text: "M. Parkinson",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.dementia",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.5",
              text: "Demenz",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.multipleSclerosis",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.6",
              text: "Multiple Sklerose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.combinedDisorderOfMuscleAndPeripheralNerve",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.7",
              text: "Neuromuskuläre Erkrankungen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.epilepsy",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.8",
              text: "Epilepsie",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.migraine",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.9",
              text: "Migräne",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.historyOfCerebrovascularAccidentWithResidualDeficit",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.10",
              text: "Z.n. Apoplex mit Residuen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.chronicNeurologicalOrMentalDiseases.historyOfCerebrovascularAccidentWithoutResidualDeficits",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-neurological-mental-diseases",
                },
              ],
              linkId: "1.17.11",
              text: "Z.n. Apoplex ohne Residuen",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasHadOxygenOrRespiratoryTherapyBeforeCurrentIllness",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/respiratory-therapies",
            },
          ],
          linkId: "1.18",
          text: "Bestand bereits vor der aktuellen Erkrankung eine Sauerstoff- oder Beatmungstherapie?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.chronicKidneyDisease",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/chronic-kidney-diseases",
            },
          ],
          linkId: "1.19",
          text: "Leidet der/die Patient*in an einer chronischen Nierenerkrankung?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "431855005",
                display: "Ja, Stadium 1",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "431856006",
                display: "Ja, Stadium 2",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "433144002",
                display: "Ja, Stadium 3",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "431857002",
                display: "Ja, Stadium 4",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "433146000",
                display: "Ja, Stadium 5 ohne Dialyse",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "714152005",
                display: "Ja, Stadium 5 mit Dialyse",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "709044004",
                display: "Ja, Stadium unbekannt",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasTravelled",
              },
            },
          ],
          linkId: "1.20",
          text: "Reiseaktivität in den letzten 14 Tagen?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.historyOfTravel",
              },
            },
          ],
          linkId: "1.21",
          text: "In welche Länder reiste der Patient?",
          type: "group",
          enableWhen: [
            {
              question: "1.20",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfTravel.from",
                  },
                },
              ],
              linkId: "1.21.1",
              text: "Von",
              type: "date",
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfTravel.till",
                  },
                },
              ],
              linkId: "1.21.2",
              text: "Bis",
              type: "date",
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfTravel.country",
                  },
                },
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system:
                          "http://hl7.org/fhir/questionnaire-item-control",
                        code: "drop-down",
                        display: "Drop down",
                      },
                    ],
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/history-of-travel",
                },
              ],
              linkId: "1.21.3",
              text: "Land",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AD",
                    display: "Andorra",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AE",
                    display: "United Arab Emirates",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AF",
                    display: "Afghanistan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AG",
                    display: "Antigua and Barbuda",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AI",
                    display: "Anguilla",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AL",
                    display: "Albania",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AM",
                    display: "Armenia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AO",
                    display: "Angola",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AQ",
                    display: "Antarctica",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AR",
                    display: "Argentina",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AS",
                    display: "American Samoa",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AT",
                    display: "Austria",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AU",
                    display: "Australia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AW",
                    display: "Aruba",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AX",
                    display: "Åland Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "AZ",
                    display: "Azerbaijan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BA",
                    display: "Bosnia and Herzegovina",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BB",
                    display: "Barbados",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BD",
                    display: "Bangladesh",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BE",
                    display: "Belgium",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BF",
                    display: "Burkina Faso",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BG",
                    display: "Bulgaria",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BH",
                    display: "Bahrain",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BI",
                    display: "Burundi",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BJ",
                    display: "Benin",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BL",
                    display: "Saint Barthélemy",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BM",
                    display: "Bermuda",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BN",
                    display: "Brunei Darussalam",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BO",
                    display: "Bolivia, Plurinational State of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BQ",
                    display: "Bonaire, Sint Eustatius and Saba",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BR",
                    display: "Brazil",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BS",
                    display: "Bahamas",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BT",
                    display: "Bhutan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BV",
                    display: "Bouvet Island",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BW",
                    display: "Botswana",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BY",
                    display: "Belarus",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "BZ",
                    display: "Belize",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CA",
                    display: "Canada",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CC",
                    display: "Cocos (Keeling) Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CD",
                    display: "Congo, the Democratic Republic of the",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CF",
                    display: "Central African Republic",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CG",
                    display: "Congo",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CH",
                    display: "Switzerland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CI",
                    display: "Côte d''Ivoire",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CK",
                    display: "Cook Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CL",
                    display: "Chile",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CM",
                    display: "Cameroon",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CN",
                    display: "China",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CO",
                    display: "Colombia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CR",
                    display: "Costa Rica",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CU",
                    display: "Cuba",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CV",
                    display: "Cabo Verde",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CW",
                    display: "Curaçao",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CX",
                    display: "Christmas Island",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CY",
                    display: "Cyprus",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "CZ",
                    display: "Czechia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DE",
                    display: "Germany",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DJ",
                    display: "Djibouti",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DK",
                    display: "Denmark",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DM",
                    display: "Dominica",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DO",
                    display: "Dominican Republic",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DZ",
                    display: "Algeria",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "EC",
                    display: "Ecuador",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "EE",
                    display: "Estonia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "EG",
                    display: "Egypt",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "EH",
                    display: "Western Sahara",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ER",
                    display: "Eritrea",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ES",
                    display: "Spain",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ET",
                    display: "Ethiopia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "FI",
                    display: "Finland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "FJ",
                    display: "Fiji",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "FK",
                    display: "Falkland Islands (Malvinas)",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "FM",
                    display: "Micronesia, Federated States of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "FO",
                    display: "Faroe Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "FR",
                    display: "France",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GA",
                    display: "Gabon",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GB",
                    display:
                      "United Kingdom of Great Britain and Northern Ireland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GD",
                    display: "Grenada",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GE",
                    display: "Georgia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GF",
                    display: "French Guiana",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GG",
                    display: "Guernsey",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GH",
                    display: "Ghana",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GI",
                    display: "Gibraltar",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GL",
                    display: "Greenland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GM",
                    display: "Gambia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GN",
                    display: "Guinea",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GP",
                    display: "Guadeloupe",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GQ",
                    display: "Equatorial Guinea",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GR",
                    display: "Greece",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GS",
                    display: "South Georgia and the South Sandwich Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GT",
                    display: "Guatemala",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GU",
                    display: "Guam",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GW",
                    display: "Guinea-Bissau",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "GY",
                    display: "Guyana",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "HK",
                    display: "Hong Kong",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "HM",
                    display: "Heard Island and McDonald Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "HN",
                    display: "Honduras",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "HR",
                    display: "Croatia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "HT",
                    display: "Haiti",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "HU",
                    display: "Hungary",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ID",
                    display: "Indonesia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IE",
                    display: "Ireland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IL",
                    display: "Israel",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IM",
                    display: "Isle of Man",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IN",
                    display: "India",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IO",
                    display: "British Indian Ocean Territory",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IQ",
                    display: "Iraq",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IR",
                    display: "Iran, Islamic Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IS",
                    display: "Iceland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "IT",
                    display: "Italy",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "JE",
                    display: "Jersey",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "JM",
                    display: "Jamaica",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "JO",
                    display: "Jordan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "JP",
                    display: "Japan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KE",
                    display: "Kenya",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KG",
                    display: "Kyrgyzstan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KH",
                    display: "Cambodia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KI",
                    display: "Kiribati",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KM",
                    display: "Comoros",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KN",
                    display: "Saint Kitts and Nevis",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KP",
                    display: "Korea, Democratic People''s Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KR",
                    display: "Korea, Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KW",
                    display: "Kuwait",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KY",
                    display: "Cayman Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "KZ",
                    display: "Kazakhstan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LA",
                    display: "Lao People''s Democratic Republic",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LB",
                    display: "Lebanon",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LC",
                    display: "Saint Lucia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LI",
                    display: "Liechtenstein",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LK",
                    display: "Sri Lanka",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LR",
                    display: "Liberia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LS",
                    display: "Lesotho",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LT",
                    display: "Lithuania",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LU",
                    display: "Luxembourg",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LV",
                    display: "Latvia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "LY",
                    display: "Libya",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MA",
                    display: "Morocco",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MC",
                    display: "Monaco",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MD",
                    display: "Moldova, Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ME",
                    display: "Montenegro",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MF",
                    display: "Saint Martin (French part)",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MG",
                    display: "Madagascar",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MH",
                    display: "Marshall Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MK",
                    display: "Macedonia, the former Yugoslav Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ML",
                    display: "Mali",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MM",
                    display: "Myanmar",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MN",
                    display: "Mongolia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MO",
                    display: "Macao",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MP",
                    display: "Northern Mariana Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MQ",
                    display: "Martinique",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MR",
                    display: "Mauritania",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MS",
                    display: "Montserrat",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MT",
                    display: "Malta",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MU",
                    display: "Mauritius",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MV",
                    display: "Maldives",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MW",
                    display: "Malawi",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MX",
                    display: "Mexico",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MY",
                    display: "Malaysia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "MZ",
                    display: "Mozambique",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NA",
                    display: "Namibia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NC",
                    display: "New Caledonia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NE",
                    display: "Niger",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NF",
                    display: "Norfolk Island",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NG",
                    display: "Nigeria",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NI",
                    display: "Nicaragua",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NL",
                    display: "Netherlands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NO",
                    display: "Norway",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NP",
                    display: "Nepal",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NR",
                    display: "Nauru",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NU",
                    display: "Niue",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "NZ",
                    display: "New Zealand",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "OM",
                    display: "Oman",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PA",
                    display: "Panama",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PE",
                    display: "Peru",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PF",
                    display: "French Polynesia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PG",
                    display: "Papua New Guinea",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PH",
                    display: "Philippines",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PK",
                    display: "Pakistan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PL",
                    display: "Poland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PM",
                    display: "Saint Pierre and Miquelon",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PN",
                    display: "Pitcairn",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PR",
                    display: "Puerto Rico",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PS",
                    display: "Palestine, State of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PT",
                    display: "Portugal",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PW",
                    display: "Palau",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "PY",
                    display: "Paraguay",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "QA",
                    display: "Qatar",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "RE",
                    display: "Réunion",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "RO",
                    display: "Romania",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "RS",
                    display: "Serbia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "RU",
                    display: "Russian Federation",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "RW",
                    display: "Rwanda",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SA",
                    display: "Saudi Arabia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SB",
                    display: "Solomon Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SC",
                    display: "Seychelles",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SD",
                    display: "Sudan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SE",
                    display: "Sweden",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SG",
                    display: "Singapore",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SH",
                    display: "Saint Helena, Ascension and Tristan da Cunha",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SI",
                    display: "Slovenia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SJ",
                    display: "Svalbard and Jan Mayen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SK",
                    display: "Slovakia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SL",
                    display: "Sierra Leone",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SM",
                    display: "San Marino",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SN",
                    display: "Senegal",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SO",
                    display: "Somalia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SR",
                    display: "Suriname",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SS",
                    display: "South Sudan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ST",
                    display: "Sao Tome and Principe",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SV",
                    display: "El Salvador",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SX",
                    display: "Sint Maarten (Dutch part)",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SY",
                    display: "Syrian Arab Republic",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "SZ",
                    display: "Swaziland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TC",
                    display: "Turks and Caicos Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TD",
                    display: "Chad",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TF",
                    display: "French Southern Territories",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TG",
                    display: "Togo",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TH",
                    display: "Thailand",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TJ",
                    display: "Tajikistan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TK",
                    display: "Tokelau",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TL",
                    display: "Timor-Leste",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TM",
                    display: "Turkmenistan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TN",
                    display: "Tunisia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TO",
                    display: "Tonga",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TR",
                    display: "Turkey",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TT",
                    display: "Trinidad and Tobago",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TV",
                    display: "Tuvalu",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TW",
                    display: "Taiwan, Province of China",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "TZ",
                    display: "Tanzania, United Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "UA",
                    display: "Ukraine",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "UG",
                    display: "Uganda",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "UM",
                    display: "United States Minor Outlying Islands",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "US",
                    display: "United States of America",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "UY",
                    display: "Uruguay",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "UZ",
                    display: "Uzbekistan",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VA",
                    display: "Holy See",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VC",
                    display: "Saint Vincent and the Grenadines",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VE",
                    display: "Venezuela, Bolivarian Republic of",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VG",
                    display: "Virgin Islands, British",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VI",
                    display: "Virgin Islands,",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VN",
                    display: "Viet Nam",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "VU",
                    display: "Vanuatu",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "WF",
                    display: "Wallis and Futuna",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "WS",
                    display: "Samoa",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "YE",
                    display: "Yemen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "YT",
                    display: "Mayotte",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ZA",
                    display: "South Africa",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ZM",
                    display: "Zambia",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "ZW",
                    display: "Zimbabwe",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfTravel.federalState",
                  },
                },
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system:
                          "http://hl7.org/fhir/questionnaire-item-control",
                        code: "drop-down",
                        display: "Drop down",
                      },
                    ],
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/history-of-travel",
                },
              ],
              linkId: "1.21.4",
              text: "Bundesland",
              type: "choice",
              enableWhen: [
                {
                  question: "1.21.3",
                  operator: "=",
                  answerCoding: {
                    system: "urn:iso:std:iso:3166",
                    code: "DE",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-BW",
                    display: "Baden-Württemberg",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-BY",
                    display: "Bayern",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-BE",
                    display: "Berlin",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-BB",
                    display: "Brandenburg",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-HB",
                    display: "Bremen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-HH",
                    display: "Hamburg",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-HE",
                    display: "Hessen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-MV",
                    display: "Mecklenburg-Vorpommern",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-NI",
                    display: "Niedersachsen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-NW",
                    display: "Nordrhein-Westfalen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-RP",
                    display: "Rheinland-Pfalz",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-SL",
                    display: "Saarland",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-SN",
                    display: "Sachsen",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-ST",
                    display: "Sachsen-Anhalt",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-SH",
                    display: "Schleswig-Holstein",
                  },
                },
                {
                  valueCoding: {
                    system: "urn:iso:std:iso:3166-2:de",
                    code: "DE-TH",
                    display: "Thüringen",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.historyOfTravel.city",
                  },
                },
              ],
              linkId: "1.21.5",
              text: "Stadt",
              type: "string",
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.hasGastrointestinalUclers",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/gastrointestinal-ulcers",
            },
          ],
          linkId: "1.22",
          text: "Leidet der/die Patient*in an Magengeschwüren?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.immunizationStatus",
              },
            },
          ],
          linkId: "1.23",
          text: "Welche Impfungen hat der Patient bereits erhalten?",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.immunizationStatus.influenza",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/immunization",
                },
              ],
              linkId: "1.23.1",
              text: "Influenza",
              type: "group",
              item: [
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.influenza.status",
                      },
                    },
                  ],
                  linkId: "1.23.1.1",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "N",
                        display: "Nein",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                        code: "asked-unknown",
                        display: "Unbekannt",
                      },
                    },
                  ],
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.influenza.date",
                      },
                    },
                  ],
                  linkId: "1.23.1.2",
                  text: "Datum",
                  type: "date",
                  enableWhen: [
                    {
                      question: "1.23.1.1",
                      operator: "=",
                      answerCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                  ],
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.immunizationStatus.pneumococcal",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/immunization",
                },
              ],
              linkId: "1.23.2",
              text: "Pneumokokken",
              type: "group",
              item: [
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.pneumococcal.status",
                      },
                    },
                  ],
                  linkId: "1.23.2.1",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "N",
                        display: "Nein",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                        code: "asked-unknown",
                        display: "Unbekannt",
                      },
                    },
                  ],
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.pneumococcal.date",
                      },
                    },
                  ],
                  linkId: "1.23.2.2",
                  text: "Datum",
                  type: "date",
                  enableWhen: [
                    {
                      question: "1.23.2.1",
                      operator: "=",
                      answerCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                  ],
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.immunizationStatus.bcg",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
                  valueString:
                    "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/immunization",
                },
              ],
              linkId: "1.23.3",
              text: "BCG",
              type: "group",
              item: [
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.bcg.status",
                      },
                    },
                  ],
                  linkId: "1.23.3.1",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "N",
                        display: "Nein",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                        code: "asked-unknown",
                        display: "Unbekannt",
                      },
                    },
                  ],
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.bcg.date",
                      },
                    },
                  ],
                  linkId: "1.23.3.2",
                  text: "Datum",
                  type: "date",
                  enableWhen: [
                    {
                      question: "1.23.3.1",
                      operator: "=",
                      answerCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                  ],
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.immunizationStatus.covid19_first",
                  },
                },
              ],
              linkId: "1.23.4",
              text: "Covid-19: 1. Impfung",
              type: "group",
              item: [
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_first.status",
                      },
                    },
                  ],
                  linkId: "1.23.4.1",
                  text: "Status",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "N",
                        display: "Nein",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                        code: "asked-unknown",
                        display: "Unbekannt",
                      },
                    },
                  ],
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_first.date",
                      },
                    },
                  ],
                  linkId: "1.23.4.2",
                  text: "Zeitpunkt der Impfung",
                  type: "date",
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_first.vaccine",
                      },
                    },
                  ],
                  linkId: "1.23.4.3",
                  text: "Impfstoff",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "COMIRNATY",
                        display: "Comirnaty® BioNTech/Pfizer",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "MODERNA",
                        display: "Spikevax COVID-19 Vaccine Moderna®",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "VAXZEVRIA",
                        display: "Vaxzevria® AstraZeneca",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "JANSSEN",
                        display: "Janssen® Johnson & Johnson",
                      },
                    },
                  ],
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.immunizationStatus.covid19_second",
                  },
                },
              ],
              linkId: "1.23.5",
              text: "Covid-19: 2. Impfung",
              type: "group",
              enableWhen: [
                {
                  question: "1.23.4.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              item: [
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_second.status",
                      },
                    },
                  ],
                  linkId: "1.23.5.1",
                  text: "Status",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "N",
                        display: "Nein",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                        code: "asked-unknown",
                        display: "Unbekannt",
                      },
                    },
                  ],
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_second.date",
                      },
                    },
                  ],
                  linkId: "1.23.5.2",
                  text: "Zeitpunkt der Impfung",
                  type: "date",
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_second.vaccine",
                      },
                    },
                  ],
                  linkId: "1.23.5.3",
                  text: "Impfstoff",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "COMIRNATY",
                        display: "Comirnaty® BioNTech/Pfizer",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "MODERNA",
                        display: "Spikevax COVID-19 Vaccine Moderna®",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "VAXZEVRIA",
                        display: "Vaxzevria® AstraZeneca",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "JANSSEN",
                        display: "Janssen® Johnson & Johnson",
                      },
                    },
                  ],
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "anamnesis.immunizationStatus.covid19_third",
                  },
                },
              ],
              linkId: "1.23.6",
              text: "Covid-19: 3. Impfung",
              type: "group",
              enableWhen: [
                {
                  question: "1.23.5.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              item: [
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_third.status",
                      },
                    },
                  ],
                  linkId: "1.23.6.1",
                  text: "Status",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "Y",
                        display: "Ja",
                      },
                    },
                    {
                      valueCoding: {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                        code: "N",
                        display: "Nein",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                        code: "asked-unknown",
                        display: "Unbekannt",
                      },
                    },
                  ],
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_third.date",
                      },
                    },
                  ],
                  linkId: "1.23.6.2",
                  text: "Zeitpunkt der Impfung",
                  type: "date",
                },
                {
                  extension: [
                    {
                      url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                        version: "1.0",
                        code: "anamnesis.immunizationStatus.covid19_third.vaccine",
                      },
                    },
                  ],
                  linkId: "1.23.6.3",
                  text: "Impfstoff",
                  type: "choice",
                  answerOption: [
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "COMIRNATY",
                        display: "Comirnaty® BioNTech/Pfizer",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "MODERNA",
                        display: "Spikevax COVID-19 Vaccine Moderna®",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "VAXZEVRIA",
                        display: "Vaxzevria® AstraZeneca",
                      },
                    },
                    {
                      valueCoding: {
                        system:
                          "https://num-compass.science/fhir/CodeSystem/Covid19Vaccine",
                        code: "JANSSEN",
                        display: "Janssen® Johnson & Johnson",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "anamnesis.resuscitateOrder",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/do-not-resuscitate-order",
            },
          ],
          linkId: "1.24",
          text: "Falls Informationen zum DNR-Status vorliegen: Möchte der/die Patient*innen wiederbelebt werden?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "304252001",
                display: "Wiederbeleben",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "304253006",
                display: "Nicht wiederbeleben",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "261665006",
                display: "Unbekannt",
              },
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "demographics",
          },
        },
      ],
      linkId: "2",
      text: "Demographie",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.biologicalSex",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/sex-assigned-at-birth",
            },
          ],
          linkId: "2.1",
          text: "Biologisches Geschlecht",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://hl7.org/fhir/administrative-gender",
                code: "male",
                display: "Male",
              },
            },
            {
              valueCoding: {
                system: "http://hl7.org/fhir/administrative-gender",
                code: "female",
                display: "Female",
              },
            },
            {
              valueCoding: {
                system: "http://hl7.org/fhir/administrative-gender",
                code: "unknown",
                display: "Unknown",
              },
            },
            {
              valueCoding: {
                system: "http://fhir.de/CodeSystem/gender-amtlich-de",
                code: "X",
                display: "unbestimmt",
              },
            },
            {
              valueCoding: {
                system: "http://fhir.de/CodeSystem/gender-amtlich-de",
                code: "D",
                display: "divers",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.pregnancyStatus",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/pregnancy-status",
            },
          ],
          linkId: "2.2",
          text: "Liegt eine Schwangerschaft vor?",
          type: "choice",
          enableWhen: [
            {
              question: "2.1",
              operator: "=",
              answerCoding: {
                system: "http://hl7.org/fhir/administrative-gender",
                code: "female",
              },
            },
          ],
          answerOption: [
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA26683-5",
                display: "Not pregnant",
              },
            },
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA15173-0",
                display: "Pregnant",
              },
            },
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "LA4489-6",
                display: "Unknown",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.ethnicGroup",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/ethnic-group",
            },
          ],
          linkId: "2.3",
          text: "ethnische Zugehörigkeit",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "14045001",
                display: "Caucasian (ethnic group)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "18167009",
                display: "Black African (ethnic group)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "315280000",
                display: "Asian - ethnic group (ethnic group)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "90027003",
                display: "Arabs (ethnic group)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "26242008",
                display: "Mixed (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "urn:oid:2.16.840.1.113883.6.238",
                code: "2135-2",
                display: "Hispanic or Latino",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.dateOfBirth",
              },
            },
          ],
          linkId: "2.4",
          text: "Geburtsdatum",
          type: "date",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.ageInYears",
              },
            },
          ],
          linkId: "2.5",
          text: "Alter bei Studieneinschluss in Jahren",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.ageInMonth",
              },
            },
          ],
          linkId: "2.6",
          text: "Alter bei Studieneinschluss in Monaten",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.frailityScore",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/frailty-score",
            },
          ],
          linkId: "2.7",
          text: "Frailty-Score vor Aufnahme",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "1",
                display: "Very Fit",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "2",
                display: "Well",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "3",
                display: "Managing Well",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "4",
                display: "Vulnerable",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "5",
                display: "Mildly Frail",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "6",
                display: "Moderately Frail",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "7",
                display: "Severely Frail",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "8",
                display: "Very Severely Frail",
              },
            },
            {
              valueCoding: {
                system:
                  "https://www.netzwerk-universitaetsmedizin.de/fhir/CodeSystem/frailty-score",
                code: "9",
                display: "Terminally Ill",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.bodyWeight",
              },
            },
          ],
          linkId: "2.8",
          text: "Körpergewicht in kg",
          type: "decimal",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "demographics.bodyHeight",
              },
            },
          ],
          linkId: "2.9",
          text: "Körpergröße in cm",
          type: "decimal",
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "epidemiologicalFactors",
          },
        },
      ],
      linkId: "3",
      text: "Epidemiologische Faktoren",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "epidemiologicalFactors.knownCovid19Exposure",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/known-exposure",
            },
          ],
          linkId: "3.1",
          text: "Hatte der/die Patient*in in den letzten 14 Tagen vor Beginn seiner/ihrer Beschwerden wissentlich Kontakt mit einer wahrscheinlich oder nachgewiesenermaßen an COVID-19 erkrankten Person?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "complications",
          },
        },
      ],
      linkId: "4",
      text: "Komplikationen",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "complications.hasHadThromboembolicComplications",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/complications-covid-19",
            },
          ],
          linkId: "4.1",
          text: "Thrombembolische Ereignisse",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "complications.thromboembolicComplications",
              },
            },
          ],
          linkId: "4.2",
          text: "Welche?",
          type: "group",
          enableWhen: [
            {
              question: "4.1",
              operator: "=",
              answerCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
          ],
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "complications.thromboembolicComplications.embolism",
                  },
                },
              ],
              linkId: "4.2.1",
              text: "Embolie",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "complications.thromboembolicComplications.thrombosis",
                  },
                },
              ],
              linkId: "4.2.2",
              text: "Thrombose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "complications.thromboembolicComplications.venousThrombosis",
                  },
                },
              ],
              linkId: "4.2.3",
              text: "Venöse Thrombose",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "complications.thromboembolicComplications.pulmonaryEmbolism",
                  },
                },
              ],
              linkId: "4.2.4",
              text: "Lungenarterienembolie",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "complications.thromboembolicComplications.cerebrovascularAccident",
                  },
                },
              ],
              linkId: "4.2.5",
              text: "Stroke",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "complications.thromboembolicComplications.myocardialInfarction",
                  },
                },
              ],
              linkId: "4.2.6",
              text: "Myokardinfarkt",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "complications.infectiousDiseaseOfLung",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/complications-covid-19",
            },
          ],
          linkId: "4.3",
          text: "Infektion der Lunge",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "complications.infectiousAgentInBloodstream",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/complications-covid-19",
            },
          ],
          linkId: "4.4",
          text: "Blutstrominfektion",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "complications.acuteRenalFailureSyndrome",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/complications-covid-19",
            },
          ],
          linkId: "4.5",
          text: "Akutes Nierenversagen",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "onsetOfIllnessOrAdmission",
          },
        },
      ],
      linkId: "5",
      text: "Krankheitsbeginn / Aufnahme",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "onsetOfIllnessOrAdmission.stageAtDiagnosis",
              },
            },
          ],
          linkId: "5.1",
          text: "Erkrankungsphase zum Zeitpunkt der COVID-19 Diagnose",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "255604002",
                display: "Mild (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "6736007",
                display: "Moderate (severity modifier) (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "24484000",
                display: "Severe (severity modifier) (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "277022003",
                display: "Remission phase (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "399166001",
                display: "Fatal (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "261665006",
                display: "Unknown (qualifier value)",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "onsetOfIllnessOrAdmission.dateTimeOfAdmission",
              },
            },
          ],
          linkId: "5.2",
          text: "Datum der Aufnahme",
          type: "date",
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "outcomeAtDischarge",
          },
        },
      ],
      linkId: "6",
      text: "Outcome bei Entlassung",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "outcomeAtDischarge.respiratoryOutcomeisVentilated",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/dependence-on-ventilator",
            },
          ],
          linkId: "6.1",
          text: "Beatmet?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "outcomeAtDischarge.dateOfDischarge",
              },
            },
          ],
          linkId: "6.2",
          text: "Zeitpunkt der Entlassung",
          type: "date",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "outcomeAtDischarge.typeOfDischarge",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/discharge-disposition",
            },
          ],
          linkId: "6.3",
          text: "Entlassungsart",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "371827001",
                display: "Patient discharged alive (finding)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "3457005",
                display: "Patient referral (procedure)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "306237005",
                display: "Referral to palliative care service (procedure)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "261665006",
                display: "Unknown (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "32485007",
                display: "Hospital admission (procedure)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "419099009",
                display: "Dead (finding)",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "outcomeAtDischarge.followupSwapResultIsPositive",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/sars-cov-2-rt-pcr",
            },
          ],
          linkId: "6.4",
          text: "Ergebnis des Folgeabstrich?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "260373001",
                display: "positiv",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "260415000",
                display: "negativ",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "419984006",
                display: "nicht eindeutig",
              },
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "studyEnrollmentOrInclusionCriteria",
          },
        },
      ],
      linkId: "7",
      text: "Studieneinschluss/Einschlusskriterien",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "studyEnrollmentOrInclusionCriteria.enrolledWithCovid19DiagnosisAsMainReason",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/study-inclusion-covid-19",
            },
          ],
          linkId: "7.1",
          text: "Bestätigte Covid-19-Diagnose als Hauptursache für Aufnahme in Studie",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "373066001",
                display: "Yes (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "373067005",
                display: "No (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "261665006",
                display: "Unknown (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "74964007",
                display: "Other (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "385432009",
                display: "Not applicable (qualifier value)",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "studyEnrollmentOrInclusionCriteria.hasPatientParticipatedInOneOrMoreInterventionalClinicalTrials",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/interventional-clinical-trial-participation",
            },
          ],
          linkId: "7.2",
          text: "Hat der Patient an einer oder mehreren interventionellen Klinischen Studie teilgenommen?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "373066001",
                display: "Yes (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "373067005",
                display: "No (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "261665006",
                display: "Unknown (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "74964007",
                display: "Other (qualifier value)",
              },
            },
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "385432009",
                display: "Not applicable (qualifier value)",
              },
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "symptoms",
          },
        },
      ],
      linkId: "8",
      text: "Symptome",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.abdominalPain",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.1",
          text: "Bauchschmerzen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.abdominalPain.presence",
                  },
                },
              ],
              linkId: "8.1.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.abdominalPain.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.1.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.1.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.asymptomatic",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.2",
          text: "Asymptomatisch",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.bleeding",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.3",
          text: "Blutung",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.bleeding.presence",
                  },
                },
              ],
              linkId: "8.3.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.bleeding.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.3.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.3.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.chestPain",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.4",
          text: "Brustschmerzen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.chestPain.presence",
                  },
                },
              ],
              linkId: "8.4.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.chestPain.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.4.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.4.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.chill",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.5",
          text: "Schüttelfrost",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.chill.presence",
                  },
                },
              ],
              linkId: "8.5.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.chill.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.5.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.5.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.conjunctivis",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.6",
          text: "Konjunktivitis",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.conjunctivis.presence",
                  },
                },
              ],
              linkId: "8.6.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.conjunctivis.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.6.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.6.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.cough",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.7",
          text: "Husten",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.cough.presence",
                  },
                },
              ],
              linkId: "8.7.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.cough.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.7.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.7.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.diarrhea",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.8",
          text: "Durchfall",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.diarrhea.presence",
                  },
                },
              ],
              linkId: "8.8.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.diarrhea.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.8.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.8.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.disturbanceOfConsciousness",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.9",
          text: "Bewusstseinsstörung",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.disturbanceOfConsciousness.presence",
                  },
                },
              ],
              linkId: "8.9.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.disturbanceOfConsciousness.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.9.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.9.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.dyspnea",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.10",
          text: "Atemnot",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.dyspnea.presence",
                  },
                },
              ],
              linkId: "8.10.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.dyspnea.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.10.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.10.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.erruptionOfSkin",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.11",
          text: "Hautausschlag",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.erruptionOfSkin.presence",
                  },
                },
              ],
              linkId: "8.11.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.erruptionOfSkin.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.11.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.11.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.fatigue",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.12",
          text: "Müdigkeit",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.fatigue.presence",
                  },
                },
              ],
              linkId: "8.12.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.fatigue.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.12.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.12.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.feelingFeverish",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.13",
          text: "Fieberigkeit",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.feelingFeverish.presence",
                  },
                },
              ],
              linkId: "8.13.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.feelingFeverish.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.13.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.13.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.fever",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.14",
          text: "Fieber",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.fever.presence",
                  },
                },
              ],
              linkId: "8.14.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.fever.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.14.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.14.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.headache",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.15",
          text: "Kopfschmerzen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.headache.presence",
                  },
                },
              ],
              linkId: "8.15.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.headache.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.15.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.15.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.hemoptysis",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.16",
          text: "Bluthusten",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.hemoptysis.presence",
                  },
                },
              ],
              linkId: "8.16.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.hemoptysis.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.16.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.16.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.indrawingOfRibsDuringRespiration",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.17",
          text: "Hauteinziehungen des Brustkorbs bei der Einatmung",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.indrawingOfRibsDuringRespiration.presence",
                  },
                },
              ],
              linkId: "8.17.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.indrawingOfRibsDuringRespiration.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.17.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.17.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.jointPain",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.18",
          text: "Gelenkschmerz",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.jointPain.presence",
                  },
                },
              ],
              linkId: "8.18.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.jointPain.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.18.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.18.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.lossOfAppetite",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.19",
          text: "Appetitverlust",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lossOfAppetite.presence",
                  },
                },
              ],
              linkId: "8.19.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lossOfAppetite.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.19.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.19.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.lossOfSenseOfSmell",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.20",
          text: "Geruchverlust",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lossOfSenseOfSmell.presence",
                  },
                },
              ],
              linkId: "8.20.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lossOfSenseOfSmell.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.20.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.20.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.lossOfTaste",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.21",
          text: "Geschmackverlust",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lossOfTaste.presence",
                  },
                },
              ],
              linkId: "8.21.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lossOfTaste.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.21.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.21.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.lymphadenopathy",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.22",
          text: "Lymphadenopathie",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lymphadenopathy.presence",
                  },
                },
              ],
              linkId: "8.22.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.lymphadenopathy.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.22.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.22.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.malaise",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.23",
          text: "Unwohlsein",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.malaise.presence",
                  },
                },
              ],
              linkId: "8.23.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.malaise.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.23.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.23.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.musclePain",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.24",
          text: "Muskelschmerzen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.musclePain.presence",
                  },
                },
              ],
              linkId: "8.24.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.musclePain.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.24.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.24.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.nasalCongestion",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.25",
          text: "Verstopfte Nase",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.nasalCongestion.presence",
                  },
                },
              ],
              linkId: "8.25.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.nasalCongestion.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.25.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.25.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.nasalDischarge",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.26",
          text: "Laufende Nase",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.nasalDischarge.presence",
                  },
                },
              ],
              linkId: "8.26.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.nasalDischarge.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.26.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.26.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.nausea",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.27",
          text: "Übelkeit",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.nausea.presence",
                  },
                },
              ],
              linkId: "8.27.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.nausea.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.27.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.27.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.painInThroat",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.28",
          text: "Halsschmerzen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.painInThroat.presence",
                  },
                },
              ],
              linkId: "8.28.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.painInThroat.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.28.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.28.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.rigor",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.29",
          text: "Starre",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.rigor.presence",
                  },
                },
              ],
              linkId: "8.29.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.rigor.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.29.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.29.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.seizure",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.30",
          text: "Krampfanfall",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.seizure.presence",
                  },
                },
              ],
              linkId: "8.30.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.seizure.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.30.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.30.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.skinUlcer",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.31",
          text: "Hautgeschwüre",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.skinUlcer.presence",
                  },
                },
              ],
              linkId: "8.31.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.skinUlcer.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.31.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.31.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.unableToWalk",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.32",
          text: "Unfähig zu gehen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.unableToWalk.presence",
                  },
                },
              ],
              linkId: "8.32.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.unableToWalk.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.32.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.32.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.vomiting",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.33",
          text: "Erbrechen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.vomiting.presence",
                  },
                },
              ],
              linkId: "8.33.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.vomiting.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.33.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.33.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.wheezing",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.34",
          text: "Keuchen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.wheezing.presence",
                  },
                },
              ],
              linkId: "8.34.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.wheezing.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.34.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.34.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.feverGreaterThan38",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.35",
          text: "Fieber über 38° Celsius",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.feverGreaterThan38.presence",
                  },
                },
              ],
              linkId: "8.35.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.feverGreaterThan38.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.35.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.35.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.asthenia",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.36",
          text: "Schwächegefühl",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.asthenia.presence",
                  },
                },
              ],
              linkId: "8.36.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.asthenia.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.36.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.36.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.pain",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.37",
          text: "Schmerzen",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.pain.presence",
                  },
                },
              ],
              linkId: "8.37.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.pain.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.37.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.37.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.productiveCough",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.38",
          text: "Produktiver Husten",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.productiveCough.presence",
                  },
                },
              ],
              linkId: "8.38.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.productiveCough.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.38.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.38.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.dryCough",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.39",
          text: "Trockener Husten",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.dryCough.presence",
                  },
                },
              ],
              linkId: "8.39.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.dryCough.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.39.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.39.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "symptoms.cloudedConsciousness",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/ValueSet/sars-cov-2-symptoms",
            },
          ],
          linkId: "8.40",
          text: "Bewusstseinstrübung",
          type: "group",
          item: [
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.cloudedConsciousness.presence",
                  },
                },
              ],
              linkId: "8.40.1",
              text: "Vorhandensein?",
              type: "choice",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
                {
                  valueCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "N",
                    display: "Nein",
                  },
                },
                {
                  valueCoding: {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "asked-unknown",
                    display: "Unbekannt",
                  },
                },
              ],
            },
            {
              extension: [
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
                  valueCoding: {
                    system:
                      "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                    version: "1.0",
                    code: "symptoms.cloudedConsciousness.severity",
                  },
                },
                {
                  url: "https://num-compass.science/fhir/StructureDefinition/DependentItem",
                  valueBoolean: true,
                },
              ],
              linkId: "8.40.2",
              text: "Schweregrad?",
              type: "choice",
              enableWhen: [
                {
                  question: "8.40.1",
                  operator: "=",
                  answerCoding: {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                    code: "Y",
                    display: "Ja",
                  },
                },
              ],
              answerOption: [
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "255604002",
                    display: "mild",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "moderat",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "24484000",
                    display: "schwer",
                  },
                },
                {
                  valueCoding: {
                    system: "http://snomed.info/sct",
                    code: "442452003",
                    display: "lebensbedrohlich",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "therapy",
          },
        },
      ],
      linkId: "9",
      text: "Therapie",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "therapy.dialysisOrHemofiltration",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/dialysis",
            },
          ],
          linkId: "9.1",
          text: "Dialyse / Hämofiltration",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "therapy.apheresis",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/apheresis",
            },
          ],
          linkId: "9.2",
          text: "Apherese",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "therapy.pronePosition",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/prone-position",
            },
          ],
          linkId: "9.3",
          text: "Bauchlage",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "therapy.ecmoTherapy",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/extracorporeal-membrane-oxygenation",
            },
          ],
          linkId: "9.4",
          text: "Extrakorporale Membranoxygenierung",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "therapy.isPatientInTheIntensiveCareUnit",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/patient-in-icu",
            },
          ],
          linkId: "9.5",
          text: "Liegt der Patient auf der Intensivstation?",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "Y",
                display: "Ja",
              },
            },
            {
              valueCoding: {
                system: "http://terminology.hl7.org/CodeSystem/v2-0136",
                code: "N",
                display: "Nein",
              },
            },
            {
              valueCoding: {
                system:
                  "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                code: "asked-unknown",
                display: "Unbekannt",
              },
            },
          ],
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "therapy.ventilationType",
              },
            },
            {
              url: "https://num-compass.science/fhir/StructureDefinition/GeccoTargetProfile",
              valueString:
                "https://www.netzwerk-universitaetsmedizin.de/fhir/StructureDefinition/respiratory-therapies",
            },
          ],
          linkId: "9.6",
          text: "Bitte dokumentieren Sie die Beatmungstherapie",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/VentilationTypes",
                code: "NASAL_HIGH_FLOW_OXYGEN",
                display: "Nasal High-Flow-Oxygen-Therapy",
              },
            },
            {
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/VentilationTypes",
                code: "NON_INVASIVE_VENTILATION",
                display: "Non-invasive ventilation",
              },
            },
            {
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/VentilationTypes",
                code: "INVASIVE_VENTILATION_OROTRACHEAL",
                display: "Invasive ventilation (orotracheal)",
              },
            },
            {
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/VentilationTypes",
                code: "INVASIVE_VENTILATION_TRACHEOTOMY",
                display: "Invasive ventilation (Tracheotomy)",
              },
            },
            {
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/VentilationTypes",
                code: "NONE",
                display: "None",
              },
            },
            {
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/VentilationTypes",
                code: "UNKNOWN",
                display: "Unknown",
              },
            },
          ],
        },
      ],
    },
    {
      extension: [
        {
          url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
          valueCoding: {
            system:
              "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
            version: "1.0",
            code: "vitalSigns",
          },
        },
      ],
      linkId: "10",
      text: "Vitalparameter",
      type: "group",
      item: [
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.pacCO2",
              },
            },
          ],
          linkId: "10.1",
          text: "Kohlendioxidpartialdruck",
          type: "decimal",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.paO2",
              },
            },
          ],
          linkId: "10.2",
          text: "Sauerstoffpartialdruck",
          type: "decimal",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.FiO2",
              },
            },
          ],
          linkId: "10.3",
          text: "FiO2",
          type: "decimal",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.pH",
              },
            },
          ],
          linkId: "10.4",
          text: "pH-Wert",
          type: "decimal",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.sofaScore",
              },
            },
          ],
          linkId: "10.5",
          text: "Sepsis-related organ failure assessment score",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.respiratoryRate",
              },
            },
          ],
          linkId: "10.6",
          text: "Atemfrequenz",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.diastolicBloodPressure",
              },
            },
          ],
          linkId: "10.7",
          text: "Blutdruck diastolisch",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.systolicBloodPressure",
              },
            },
          ],
          linkId: "10.8",
          text: "Blutdruck systolisch",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.heartRate",
              },
            },
          ],
          linkId: "10.9",
          text: "Herzfrequenz",
          type: "integer",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.bodyTemperature",
              },
            },
          ],
          linkId: "10.10",
          text: "Körpertemperatur",
          type: "decimal",
        },
        {
          extension: [
            {
              url: "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
              valueCoding: {
                system:
                  "https://num-compass.science/fhir/CodeSystem/CompassGeccoItem",
                version: "1.0",
                code: "vitalSigns.peripheralOxygenSaturation",
              },
            },
          ],
          linkId: "10.11",
          text: "Periphere Sauerstoffsättigung",
          type: "decimal",
        },
      ],
    },
  ],
};
