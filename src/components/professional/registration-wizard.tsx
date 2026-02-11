"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/actions/profile-actions";
import {
  basicInfoSchema,
  categorySchema,
  neighborhoodsSchema,
  descriptionSchema,
  type BasicInfoFormData,
  type CategoryFormData,
  type NeighborhoodsFormData,
  type DescriptionFormData,
} from "@/lib/validations/profile-schema";
import type { Category, Neighborhood } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEP_TITLES = [
  "Datos personales",
  "Categoría de servicio",
  "Barrios de cobertura",
  "Descripción del servicio",
];

const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Disponible",
  busy: "Ocupado",
  unavailable: "No disponible",
};

const PRICE_RANGE_LABELS: Record<string, string> = {
  low: "Económico",
  medium: "Medio",
  high: "Alto",
  premium: "Premium",
};

export function RegistrationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Collected data from previous steps
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryFormData | null>(null);
  const [neighborhoodsData, setNeighborhoodsData] = useState<NeighborhoodsFormData | null>(null);

  // Fetched data from Supabase
  const [categories, setCategories] = useState<Category[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [categoriesResult, neighborhoodsResult] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("neighborhoods")
          .select("*")
          .eq("is_active", true)
          .order("zone, name" as never),
      ]);

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }
      if (neighborhoodsResult.data) {
        setNeighborhoods(neighborhoodsResult.data);
      }
      setLoadingData(false);
    };

    fetchData();
  }, []);

  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    setBasicInfo(data);
    setCurrentStep(1);
  };

  const handleCategorySubmit = (data: CategoryFormData) => {
    setCategoryData(data);
    setCurrentStep(2);
  };

  const handleNeighborhoodsSubmit = (data: NeighborhoodsFormData) => {
    setNeighborhoodsData(data);
    setCurrentStep(3);
  };

  const handleDescriptionSubmit = async (data: DescriptionFormData) => {
    if (!basicInfo || !categoryData || !neighborhoodsData) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createProfile({
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        phone: basicInfo.phone,
        whatsapp: basicInfo.whatsapp || undefined,
        email: basicInfo.email,
        categoryId: categoryData.categoryId,
        neighborhoodIds: neighborhoodsData.neighborhoodIds,
        description: data.description || undefined,
        yearsExperience: data.yearsExperience,
        availability: data.availability,
        priceRange: data.priceRange,
      });

      if (result.error) {
        setSubmitError(result.error);
      } else {
        router.push("/mi-perfil");
      }
    } catch {
      setSubmitError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loadingData) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando datos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEP_TITLES.map((title, index) => (
          <div key={title} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            {index < STEP_TITLES.length - 1 && (
              <div
                className={`h-0.5 w-8 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Paso {currentStep + 1} de {STEP_TITLES.length}: {STEP_TITLES[currentStep]}
      </p>

      {/* Step content */}
      {currentStep === 0 && (
        <StepBasicInfo
          defaultValues={basicInfo}
          onSubmit={handleBasicInfoSubmit}
        />
      )}
      {currentStep === 1 && (
        <StepCategory
          categories={categories}
          defaultValues={categoryData}
          onSubmit={handleCategorySubmit}
          onBack={goBack}
        />
      )}
      {currentStep === 2 && (
        <StepNeighborhoods
          neighborhoods={neighborhoods}
          defaultValues={neighborhoodsData}
          onSubmit={handleNeighborhoodsSubmit}
          onBack={goBack}
        />
      )}
      {currentStep === 3 && (
        <StepDescription
          onSubmit={handleDescriptionSubmit}
          onBack={goBack}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </div>
  );
}

// ---------- Step 1: Basic Info ----------

function StepBasicInfo({
  defaultValues,
  onSubmit,
}: {
  defaultValues: BasicInfoFormData | null;
  onSubmit: (data: BasicInfoFormData) => void;
}) {
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      phone: "",
      whatsapp: "",
      email: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos personales</CardTitle>
        <CardDescription>
          Completá tu información de contacto. Estos datos se mostrarán en tu perfil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Juan"
                        autoComplete="given-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pérez"
                        autoComplete="family-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="351 1234567"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="351 1234567"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Si es distinto al teléfono. Si lo dejás vacío, se usa el teléfono.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">Siguiente</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ---------- Step 2: Category ----------

function StepCategory({
  categories,
  defaultValues,
  onSubmit,
  onBack,
}: {
  categories: Category[];
  defaultValues: CategoryFormData | null;
  onSubmit: (data: CategoryFormData) => void;
  onBack: () => void;
}) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? {
      categoryId: 0,
    },
  });

  const selectedCategoryId = form.watch("categoryId");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categoría de servicio</CardTitle>
        <CardDescription>
          Seleccioná la categoría principal de los servicios que ofrecés.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => field.onChange(category.id)}
                          className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors hover:border-primary/50 ${
                            selectedCategoryId === category.id
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          {category.icon && (
                            <span className="text-2xl">{category.icon}</span>
                          )}
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Anterior
              </Button>
              <Button type="submit">Siguiente</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ---------- Step 3: Neighborhoods ----------

function StepNeighborhoods({
  neighborhoods,
  defaultValues,
  onSubmit,
  onBack,
}: {
  neighborhoods: Neighborhood[];
  defaultValues: NeighborhoodsFormData | null;
  onSubmit: (data: NeighborhoodsFormData) => void;
  onBack: () => void;
}) {
  const form = useForm<NeighborhoodsFormData>({
    resolver: zodResolver(neighborhoodsSchema),
    defaultValues: defaultValues ?? {
      neighborhoodIds: [],
    },
  });

  const selectedIds = form.watch("neighborhoodIds");

  // Group neighborhoods by zone
  const groupedByZone = neighborhoods.reduce<Record<string, Neighborhood[]>>(
    (acc, neighborhood) => {
      const zone = neighborhood.zone;
      if (!acc[zone]) {
        acc[zone] = [];
      }
      acc[zone].push(neighborhood);
      return acc;
    },
    {}
  );

  const zones = Object.keys(groupedByZone).sort();

  const toggleNeighborhood = (id: number) => {
    const current = form.getValues("neighborhoodIds");
    if (current.includes(id)) {
      form.setValue(
        "neighborhoodIds",
        current.filter((nId) => nId !== id),
        { shouldValidate: true }
      );
    } else {
      if (current.length >= 5) return;
      form.setValue("neighborhoodIds", [...current, id], {
        shouldValidate: true,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barrios de cobertura</CardTitle>
        <CardDescription>
          Seleccioná los barrios donde ofrecés tus servicios (máximo 5 en el plan
          gratuito).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="neighborhoodIds"
              render={() => (
                <FormItem>
                  <div className="mb-2 text-sm text-muted-foreground">
                    {selectedIds.length}/5 barrios seleccionados
                  </div>
                  <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border p-4">
                    {zones.map((zone) => (
                      <div key={zone}>
                        <h4 className="mb-2 text-sm font-semibold text-foreground">
                          {zone}
                        </h4>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {groupedByZone[zone].map((neighborhood) => {
                            const isSelected = selectedIds.includes(
                              neighborhood.id
                            );
                            const isDisabled =
                              !isSelected && selectedIds.length >= 5;

                            return (
                              <label
                                key={neighborhood.id}
                                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
                                  isDisabled
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onCheckedChange={() =>
                                    toggleNeighborhood(neighborhood.id)
                                  }
                                />
                                <span>{neighborhood.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Anterior
              </Button>
              <Button type="submit">Siguiente</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ---------- Step 4: Description ----------

function StepDescription({
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}: {
  onSubmit: (data: DescriptionFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const form = useForm<DescriptionFormData>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: "",
      yearsExperience: undefined,
      availability: undefined,
      priceRange: undefined,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Descripción del servicio</CardTitle>
        <CardDescription>
          Contá sobre tu experiencia y servicios. Estos campos son opcionales pero
          ayudan a que te encuentren más clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contá sobre tus servicios, experiencia y especialidades..."
                      className="min-h-24"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Máximo 500 caracteres en el plan gratuito.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Años de experiencia (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={99}
                      placeholder="Ej: 5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná tu disponibilidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(AVAILABILITY_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rango de precios (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná un rango de precios" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(PRICE_RANGE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Anterior
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando perfil..." : "Crear perfil"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
