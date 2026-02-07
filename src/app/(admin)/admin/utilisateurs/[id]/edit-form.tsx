"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Save, Users, Eye, EyeOff, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateUser } from "@/lib/actions/users";
import { testWhatsAppNotification } from "@/lib/actions/notifications";

const userFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  role: z.nativeEnum(Role),
  isActive: z.boolean(),
  telephone: z.string().optional(),
  whatsappApiKey: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean;
  telephone: string | null;
  whatsappApiKey: string | null;
};

interface EditUserFormProps {
  user: User;
  isSelf?: boolean;
}

export function EditUserForm({ user, isSelf = false }: EditUserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(userFormSchema) as any,
    defaultValues: {
      name: user.name || "",
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
      isActive: user.isActive,
      telephone: user.telephone || "",
      whatsappApiKey: user.whatsappApiKey || "",
    },
  });

  async function onSubmit(data: UserFormValues) {
    setIsLoading(true);

    try {
      const updateData: {
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        password?: string;
        telephone?: string | null;
        whatsappApiKey?: string | null;
      } = {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        telephone: data.telephone || null,
        whatsappApiKey: data.whatsappApiKey || null,
      };

      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      const result = await updateUser(user.id, updateData);

      if (result.success) {
        toast.success("Utilisateur mis a jour avec succes");
        router.push("/admin/utilisateurs");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la mise a jour");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTestWhatsApp() {
    const phone = form.getValues("telephone");
    const apiKey = form.getValues("whatsappApiKey");

    if (!phone || !apiKey) {
      toast.error("Renseignez le numero et la cle API avant de tester");
      return;
    }

    setIsTesting(true);
    try {
      const result = await testWhatsAppNotification(phone, apiKey);
      if (result.success) {
        toast.success("Message de test envoye !");
      } else {
        toast.error(result.error || "Erreur lors du test");
      }
    } catch {
      toast.error("Erreur lors du test");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tete */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/utilisateurs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Modifier l&apos;utilisateur
          </h1>
          <p className="mt-1 text-muted-foreground">
            {user.name || user.email}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                  <CardDescription>
                    Les informations de connexion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jean@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nouveau mot de passe</CardTitle>
                  <CardDescription>
                    Laissez vide pour ne pas modifier
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Minimum 8 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Retapez le mot de passe
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne laterale */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Role et statut</CardTitle>
                  <CardDescription>
                    Permissions de l&apos;utilisateur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSelf}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrateur</SelectItem>
                            <SelectItem value="EDITOR">Editeur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {isSelf
                            ? "Vous ne pouvez pas modifier votre propre role."
                            : "Admin: acces complet. Editeur: acces limite."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Compte actif</FormLabel>
                          <FormDescription>
                            Peut se connecter
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Notifications WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Recevez les alertes sur WhatsApp via CallMeBot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N WhatsApp</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="22501020304"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Format international sans + (ex: 22501020304)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsappApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cle API CallMeBot</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Envoyez &quot;I allow callmebot to send me messages&quot; au{" "}
                          <strong>+34 623 78 95 80</strong> sur WhatsApp pour recevoir votre cle.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestWhatsApp}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Tester
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Enregistrer les modifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
