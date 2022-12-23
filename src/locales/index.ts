// TODO: remove objects if not needed
export const en = {
  lang: "en",
  components: {
    reverseAnswer: "Reverse Answer",
    reverseQuestion: "Reverse Question",
    remove: "Remove",
    fieldEmpty: "Field Empty!",
    linkId: "Link ID",
    navigationBar: {
      version: "Version",
      metaInformation: "Metadata",
      metadataItems: {
        identifier: "Identifier",
        URL: "URL",
        name: "Name",
        title: "Title",
        date: "Date",
        status: "Status",
        publisher: "Publisher",
        approvalDate: "Approval Date",
        lastReviewDate: "Last Review Date",
        experimental: "Experimental",
      },
      ImportJSONBtn: "Import JSON",
      ExportJSONBtn: "Export JSON",
      createNewQRE: "Create new questionnaire",
      warningLeaveDialog: {
        title: "Warning",
        instructions:
          "Are you sure that you want to leave the edition questionnaire screen without exporting first?",
        continue: "Continue",
        cancel: "Cancel",
      },
    },
  },
  views: {
    import: {
      dropFile: "Drop a file here",
      instructions:
        "Please upload a Questionnaire JSON file that you would like to edit. Drag & drop the file on this area or click here to select a file.",
    },
    editor: {
      conditionFulfilled: "Condition Fulfilled",
      enableWhenCondition: "Condition: enableWhen",
      questionDontexist: "Question does not exist in this Questionnaire.",
      backLastItem: "Back to item",
      navigateToItem: "Navigate to item",
      toSelectOneAnswer: "Double tap to select one answer option.",
      dragItem: "Drag Item",
      answers: "Answers",
      itemConditions: "Conditions",
      addNewCondition: "Add New Condition",
      addItem: "New Item",
      deleteItem: "Delete Item",
      question: "Question",
      questions: "Questions",
      operator: "Operator",
      answer: "Answer",
      answerSelected: "Answer Overview",
      AnswerValueSet: "Answer Value Set",
      selectAnswer: "Select Question",
      AnswerOptions: "Answer Options",
      system: "System",
      code: "Code",
      newQuestion: "New Item",
      addAnswer: "ADD ANSWER",
      reverseText: "Reverse Original Text",
      newUUID: "New UUID",
      maxLength: "MaxLength",
      sliderStepValue: "Slider Step Value",
      minValue: "Min Value",
      lowRangeLabel: "Low Range Label",
      maxValue: "Max Value",
      highRangeLabel: "High Range Label",
      extensions: "Extensions",
      UUID: "UUID",
      regenerateUUID: "Regenerate UUID",
      showQuestionContidions: "Show Item Conditions",
      disableItem: "Disable Item",
      enableItem: "Enabled Item",
      originalText: "Original Text",
      optionsAnswers: {
        choice: "Choice",
        open: "Open",
        boolean: "Boolean",
      },
    },
    tabsTitles: {
      ediorQRE: "Questionnaire Items",
      metadata: "Questionnaire Metadata",
      settings: "Editor Settings",
    },
    tabs: {
      metadata: {
        addNewId: "Add new Identifier",
        removeId: "Remove ID",
        use: "Use",
        system: "System",
        value: "Value",
        period: {
          period: "Period",
          start: "Start",
          end: "End",
        },
        type: {
          type: "Type",
          coding: {
            coding: "Coding",
            system: "System",
            version: "Version",
            code: "Code",
            display: "Display",
            userSelected: "User Selected",
          },
          text: "Text",
        },
      },
      settings: {
        Answers: {
          title: "Answers",
          AnswerValueset: "Answer Value Set",
          OpenChoice: "Open Choice Enabled",
          Choice: "Choice Enabled",
        },
      },
    },
  },
  export: {
    successfully: "Successfully export",
  },
  messagesErrors: {
    warning: "Warning",
    error: "Error",
    fileNoExported:
      "JSON File could no be exported. File was downloaded in Donwloads instead.",
    QuestionnaireValidations: {
      test: "test",
    },
    FHIRValidations: {
      nodeMissing:
        "FHIR Resource Content Invalid! Missing Information on {node}. {item}",
      resourceImportedNoAllow: "Resource {resource} Imported is not allowed",
      nodeMissingItem:
        "FHIR Resource Content Invalid! {node} in Item {linkId}.",
      typeNodeNoValAllow: "Item {linkId} {type} type value is not allowed.",
      posiblesValues: "{currentValue} value is no allowed in {node}.",
      moreThan5Levels: "Item {linkId} has more that 5 levels.",
      answerOptionAndValueSetNoAllow:
        "Item {linkId} has [answerOption] and [answerValueSet], both are not allowed.",
      linkId:
        "Item: [{linkId} - {text}] has an error, it doesn't follow the right sequence of LinkId. Link ID should be {internalId} instead if {linkId}.",
    },
    GeneralJSONValidations: {
      test: "test",
      fileNoJSONType:
        "File {nameFile} imported is no a JSON File. Only JSON Files are allowed.",
      NoJSONFILEStructure:
        "Content of file loaded has no a properly structure of a JSON. ",
    },
  },
} as const;

export type I18nType<T extends object> = {
  [Key in keyof T]: T[Key] extends object ? I18nType<T[Key]> : string;
};

export type Language = I18nType<typeof en>;

export const de: Language = {
  lang: "de",
  components: {
    reverseAnswer: "Setze Antwort zurück",
    reverseQuestion: "Setze Frage zurück",
    remove: "Entferne",
    fieldEmpty: "Leeres Feld!",
    linkId: "Link ID",
    navigationBar: {
      version: "Version",
      metaInformation: "Metadaten",
      metadataItems: {
        identifier: "Identifier",
        URL: "URL",
        name: "Name",
        title: "Titel",
        date: "Datum",
        status: "Status",
        publisher: "Publisher",
        approvalDate: "Genehmigungsdatum",
        lastReviewDate: "Letztes Überprüfungsdatum",
        experimental: "Experimental",
      },
      ImportJSONBtn: "Importiere JSON",
      ExportJSONBtn: "Exportiere JSON",
      createNewQRE: "Erstelle neuen Fragebogen",
      warningLeaveDialog: {
        title: "Warnung",
        instructions: "Seite verlassen ohne zu Exportieren?",
        continue: "Fortfahren",
        cancel: "Abbrechen",
      },
    },
  },
  views: {
    import: {
      dropFile: "Lege eine Datei hier ab",
      instructions:
        "Lade Fragebogen-Datei im JSON-Format hoch. Ziehe die Datei in diesen Bereich oder klicke hier um eine auszuwählen.",
    },
    editor: {
      conditionFulfilled: "Condition erfüllt",
      enableWhenCondition: "Condition: enableWhen",
      questionDontexist: "Frage existiert nicht in diesem Fragebogen.",
      backLastItem: "Zurück zum Element",
      navigateToItem: "Navigiere zum Element",
      toSelectOneAnswer: "Doppelklick um eine Antwortmöglichkeit auszuwählen.",
      dragItem: "Ziehe Element",
      answers: "Antworten",
      itemConditions: "Conditions",
      addNewCondition: "Füge neue Condition hinzu",
      addItem: "Neues Element",
      deleteItem: "Lösche Element",
      question: "Frage",
      questions: "Fragen",
      operator: "Operator",
      answer: "Antwort",
      answerSelected: "Antwortübersicht",
      AnswerValueSet: "Antwortwertemengen",
      selectAnswer: "Wähle Frage",
      AnswerOptions: "Antwortoptionen",
      system: "System",
      code: "Code",
      newQuestion: "Neues Element",
      addAnswer: "NEUE ANWORT",
      reverseText: "Setze originalen Text zurück",
      newUUID: "Neue UUID",
      maxLength: "MaxLength",
      sliderStepValue: "Slider Schrittwerte",
      minValue: "Min Value",
      lowRangeLabel: "Low Range Label",
      maxValue: "Max Value",
      highRangeLabel: "High Range Label",
      extensions: "Extensions",
      UUID: "UUID",
      regenerateUUID: "Regeneriere UUID",
      showQuestionContidions: "Zeige Element Conditions",
      disableItem: "Deaktiviere Element",
      enableItem: "Aktiviere Element",
      originalText: "Originaler Text",
      optionsAnswers: {
        choice: "Auswahl",
        open: "Frei",
        boolean: "Boolean",
      },
    },
    tabsTitles: {
      ediorQRE: "Fragebogenelemente",
      metadata: "Fragebogenmetadaten",
      settings: "Editorkonfiguration",
    },
    tabs: {
      metadata: {
        addNewId: "Füge neuen Identifier hinzu",
        removeId: "Entferne ID",
        use: "Use",
        system: "System",
        value: "Value",
        period: {
          period: "Period",
          start: "Start",
          end: "End",
        },
        type: {
          type: "Type",
          coding: {
            coding: "Coding",
            system: "System",
            version: "Version",
            code: "Code",
            display: "Display",
            userSelected: "User Selected",
          },
          text: "Text",
        },
      },
      settings: {
        Answers: {
          title: "Antworten",
          AnswerValueset: "Antwortwertemengen",
          OpenChoice: "Freie Auswahl aktiviert",
          Choice: "Auswahl aktiviert",
        },
      },
    },
  },
  export: {
    successfully: "Erfolgreich exportiert",
  },
  messagesErrors: {
    warning: "Warnung",
    error: "Fehler",
    fileNoExported:
      "JSON-Datei konnte nicht exportiert werden. Datei wurde stattdessen in Downloads heruntergeladen.",
    QuestionnaireValidations: {
      test: "test",
    },
    FHIRValidations: {
      nodeMissing:
        "Inhalt der FHIR-Ressource ist ungültig! Fehlende Informationen in {node}. {item}",
      resourceImportedNoAllow:
        "Ressourcentyp {resource} darf nicht importiert werden",
      nodeMissingItem:
        "Inhalt der FHIR-Ressource ist ungültig! {node} in Element {linkId}.",
      typeNodeNoValAllow:
        "Element {linkId} hat nicht unterstützten Typ: {type}",
      posiblesValues: "Wert {currentValue} ist nicht erlaubt in {node}.",
      moreThan5Levels: "Element {linkId} hat mehr als 5 Level.",
      answerOptionAndValueSetNoAllow:
        "Element {linkId} hat [answerOption] und [answerValueSet], beide sind nicht gleichzeitig erlaubt.",
      linkId:
        "Element: [{linkId} - {text}] hat eine ungültige Sequenz in der LinkId. LinkId sollte stattdessen {internalId} sein, falls {linkId}.",
    },
    GeneralJSONValidations: {
      test: "test",
      fileNoJSONType:
        "Importierte Datei {nameFile} ist keine JSON-Datei. Nur JSON-Dateien sind erlaubt.",
      NoJSONFILEStructure:
        "Inhalt der geladenen Datei hat eine ungültige JSON-Struktur.",
    },
  },
} as const;
