import { Item } from "@/types";
import { ParsedItem } from "./importing/parsing/item";

export const allItemTypes = [
  "group",
  "string",
  "choice",
  "open-choice",
  "boolean",
  "decimal",
  "integer",
  "date",
  "text",
  "url",
  "display",
  "time",
  "dateTime",
  "quantity",
  "attachment",
  "coding",
  "reference",
] as const;
export type ItemType = typeof allItemTypes[number];
export function isInvalidItemType(type: unknown): boolean {
  return !allItemTypes.includes(type as ItemType);
}
export function allowsMaxLength(item: Item | ParsedItem): boolean {
  const type = item.type;
  const answerConstraint = item.answerConstraint;
  return (
    answerConstraint === "optionsOrString" ||
    type === "boolean" ||
    type === "decimal" ||
    type === "integer" ||
    type === "string" ||
    type === "text" ||
    type === "open-choice" ||
    type === "url"
  );
}

export const itemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "choice", icon: "toc", label: "Choice" },
  { name: "open-choice", icon: "horizontal_split", label: "Open-Choice" },
  { name: "display", icon: "description", label: "Display" },
  { name: "text", icon: "input", label: "Text" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "url", icon: "link", label: "URL" },
  { name: "boolean", icon: "toggle_off", label: "Boolean" },
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "decimal", icon: "pin", label: "Decimal" },
  { name: "date", icon: "calendar_month", label: "Date" },
  { name: "time", icon: "schedule", label: "Time" },
  { name: "dateTime", icon: "event", label: "DateTime" },
  { name: "quantity", icon: "biotech", label: "Quantity" },
  { name: "attachment", icon: "library_add", label: "Attachment" },
  { name: "coding", icon: "code", label: "Coding" },
  { name: "reference", icon: "manage_search", label: "Reference" },
] as const;
export type ItemTypeLabel = typeof itemTypeIcons[number];
export type ItemTypeIcon = ItemTypeLabel["icon"];

export const noChoiceItemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "choice", icon: "toc", label: "Choice" },
  { name: "open-choice", icon: "horizontal_split", label: "Open-Choice" },
  { name: "display", icon: "description", label: "Display" },
  { name: "text", icon: "input", label: "Text" },
  { name: "url", icon: "link", label: "URL" },
  { name: "boolean", icon: "toggle_off", label: "Boolean" },
  { name: "attachment", icon: "library_add", label: "Attachment" },
] as const;
export const choiceItemTypeIcons = [
  { name: "coding", icon: "code", label: "Coding" },
  { name: "decimal", icon: "pin", label: "Decimal" },
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "date", icon: "calendar_month", label: "Date" },
  { name: "dateTime", icon: "event", label: "DateTime" },
  { name: "time", icon: "schedule", label: "Time" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "quantity", icon: "biotech", label: "Quantity" },
  { name: "reference", icon: "manage_search", label: "Reference" },
] as const;

export type AnswerOptionButton = typeof choiceItemTypeIcons[number];
export type AnswerOptionType = typeof choiceItemTypeIcons[number]["name"];
export type AnswerOptionIcon = typeof choiceItemTypeIcons[number]["icon"];

export function getAnswerOptionIcon(type: AnswerOptionType): AnswerOptionIcon {
  const answerOptionButton = choiceItemTypeIcons.find((a) => a.name === type);
  if (answerOptionButton === undefined) {
    console.error(`Illegal AnswerOptionType: ${type}`);
    return "" as unknown as AnswerOptionIcon;
  }
  return answerOptionButton.icon;
}

export function allowsAnswerChoice(type: ItemType): type is AnswerOptionType {
  return choiceItemTypeIcons.some((i) => i.name === type);
}

export function getItemTypeIcon(type: ItemType): ItemTypeIcon {
  const icon = itemTypeIcons.find((i) => i.name === type);
  if (icon === undefined) {
    console.error(`Invalid itemType: ${type}`);
    return undefined as unknown as ItemTypeIcon;
  }
  return icon.icon;
}

export const notSelectableQuestionTypes = [
  "attachment",
  "display",
  "group",
  "open-choice",
  "choice",
] as const;
export type NotSelectableItem = typeof notSelectableQuestionTypes[number];

export function isSelectableItem(item: Item): boolean {
  const selectableType = !notSelectableQuestionTypes.includes(
    item.type as NotSelectableItem,
  );
  const emptyAnswerOption =
    item.answerOption === undefined || item.answerOption.length === 0;
  return selectableType && emptyAnswerOption;
}

export const COLORS = {
  itemDragOver: "rgb(2,123,227,0.5)",
} as const;

export const MAX_ALLOWED_LEVELS = 5;
export const MAX_ALLOWED_LEVELS_FOR_GROUPS = MAX_ALLOWED_LEVELS - 1;
export const DRAG_KEY_INTERNAL_ID = "internalId";
export const MAX_LENGTH_LINKID = 255;

export type ResourceType = typeof resourceTypes[number];
export const resourceTypes = [
  "Account",
  "ActivityDefinition",
  "ActorDefinition",
  "AdministrableProductDefinition",
  "AdverseEvent",
  "AllergyIntolerance",
  "Appointment",
  "AppointmentResponse",
  "ArtifactAssessment",
  "AuditEvent",
  "Basic",
  "Binary",
  "BiologicallyDerivedProduct",
  "BiologicallyDerivedProductDispense",
  "BodyStructure",
  "Bundle",
  "CapabilityStatement",
  "CarePlan",
  "CareTeam",
  "ChargeItem",
  "ChargeItemDefinition",
  "Citation",
  "Claim",
  "ClaimResponse",
  "ClinicalImpression",
  "ClinicalUseDefinition",
  "CodeSystem",
  "Communication",
  "CommunicationRequest",
  "CompartmentDefinition",
  "Composition",
  "ConceptMap",
  "Condition",
  "ConditionDefinition",
  "Consent",
  "Contract",
  "Coverage",
  "CoverageEligibilityRequest",
  "CoverageEligibilityResponse",
  "DetectedIssue",
  "Device",
  "DeviceAssociation",
  "DeviceDefinition",
  "DeviceDispense",
  "DeviceMetric",
  "DeviceRequest",
  "DeviceUsage",
  "DiagnosticReport",
  "DocumentReference",
  "Encounter",
  "EncounterHistory",
  "Endpoint",
  "EnrollmentRequest",
  "EnrollmentResponse",
  "EpisodeOfCare",
  "EventDefinition",
  "Evidence",
  "EvidenceReport",
  "EvidenceVariable",
  "ExampleScenario",
  "ExplanationOfBenefit",
  "FamilyMemberHistory",
  "Flag",
  "FormularyItem",
  "GenomicStudy",
  "Goal",
  "GraphDefinition",
  "Group",
  "GuidanceResponse",
  "HealthcareService",
  "ImagingSelection",
  "ImagingStudy",
  "Immunization",
  "ImmunizationEvaluation",
  "ImmunizationRecommendation",
  "ImplementationGuide",
  "Ingredient",
  "InsurancePlan",
  "InventoryItem",
  "InventoryReport",
  "Invoice",
  "Library",
  "Linkage",
  "List",
  "Location",
  "ManufacturedItemDefinition",
  "Measure",
  "MeasureReport",
  "Medication",
  "MedicationAdministration",
  "MedicationDispense",
  "MedicationKnowledge",
  "MedicationRequest",
  "MedicationStatement",
  "MedicinalProductDefinition",
  "MessageDefinition",
  "MessageHeader",
  "MolecularSequence",
  "NamingSystem",
  "NutritionIntake",
  "NutritionOrder",
  "NutritionProduct",
  "Observation",
  "ObservationDefinition",
  "OperationDefinition",
  "OperationOutcome",
  "Organization",
  "OrganizationAffiliation",
  "PackagedProductDefinition",
  "Parameters",
  "Patient",
  "PaymentNotice",
  "PaymentReconciliation",
  "Permission",
  "Person",
  "PlanDefinition",
  "Practitioner",
  "PractitionerRole",
  "Procedure",
  "Provenance",
  "Questionnaire",
  "QuestionnaireResponse",
  "RegulatedAuthorization",
  "RelatedPerson",
  "RequestOrchestration",
  "Requirements",
  "ResearchStudy",
  "ResearchSubject",
  "RiskAssessment",
  "Schedule",
  "SearchParameter",
  "ServiceRequest",
  "Slot",
  "Specimen",
  "SpecimenDefinition",
  "StructureDefinition",
  "StructureMap",
  "Subscription",
  "SubscriptionStatus",
  "SubscriptionTopic",
  "Substance",
  "SubstanceDefinition",
  "SubstanceNucleicAcid",
  "SubstancePolymer",
  "SubstanceProtein",
  "SubstanceReferenceInformation",
  "SubstanceSourceMaterial",
  "SupplyDelivery",
  "SupplyRequest",
  "Task",
  "TerminologyCapabilities",
  "TestPlan",
  "TestReport",
  "TestScript",
  "Transport",
  "ValueSet",
  "VerificationResult",
  "VisionPrescription",
] as const;
