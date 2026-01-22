"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateFarmer } from "@/hooks/use-farmers";
import { farmerSchema } from "@/schema/farmer";

// Define crop options
const CROP_OPTIONS = [
  "Maize",
  "Rice",
  "Wheat",
  "Soybeans",
  "Cotton",
  "Potatoes",
  "Tomatoes",
  "Onions",
];

export function FarmerForm() {
  const createFarmerMutation = useCreateFarmer();

  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      assignedCrops: [] as string[],
      lastUpdated: new Date().toISOString(),
    },
    validators: {
      onDynamic: farmerSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      try {
        await createFarmerMutation.mutateAsync(value);
        toast.success(`Farmer ${value.name} registered successfully!`);
        // Reset form after successful submission
        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to register farmer. Please try again."
        );
      }
    },
  });

  const comboboxAnchor = useComboboxAnchor();

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-6 font-bold text-xl">Register New Farmer</h2>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="id">
          {(field) => (
            <Field className="space-y-2">
              <FieldLabel>Identifier</FieldLabel>
              <FieldContent>
                <Input
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter identifier"
                  value={field.state.value}
                />
              </FieldContent>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
        <form.Field name="name">
          {(field) => (
            <Field className="space-y-2">
              <FieldLabel>Full Name</FieldLabel>
              <FieldContent>
                <Input
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter farmer name"
                  value={field.state.value}
                />
              </FieldContent>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="assignedCrops">
          {(field) => (
            <Field className="space-y-2">
              <FieldLabel>Assigned Crops</FieldLabel>
              <FieldContent>
                <Combobox
                  multiple={true}
                  onValueChange={(val) => field.handleChange(val as string[])}
                  value={field.state.value}
                >
                  <div
                    className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ref={comboboxAnchor}
                  >
                    <ComboboxChips className="flex-1 gap-1">
                      {field.state.value.map((crop) => (
                        <ComboboxChip key={crop}>{crop}</ComboboxChip>
                      ))}
                      <ComboboxInput
                        className="min-w-[80px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                        placeholder={
                          field.state.value.length === 0
                            ? "Select crops..."
                            : ""
                        }
                      />
                    </ComboboxChips>
                  </div>

                  <ComboboxContent
                    anchor={comboboxAnchor}
                    className="w-[--anchor-width]"
                  >
                    <ComboboxList>
                      <ComboboxEmpty>No crops found.</ComboboxEmpty>
                      {CROP_OPTIONS.map((crop) => (
                        <ComboboxItem key={crop} value={crop}>
                          {crop}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FieldContent>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              className="w-full"
              disabled={!canSubmit || createFarmerMutation.isPending}
              type="submit"
            >
              {isSubmitting || createFarmerMutation.isPending
                ? "Registering..."
                : "Register Farmer"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
