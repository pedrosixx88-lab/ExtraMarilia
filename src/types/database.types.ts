export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      bairros: {
        Row: {
          id: string;
          name: string;
          slug: string;
          active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["bairros"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["bairros"]["Insert"]>;
      };
      requests: {
        Row: {
          id: string;
          nome: string;
          whatsapp: string;
          email: string | null;
          descricao: string;
          category_id: string;
          bairro_id: string;
          urgente: boolean;
          status: "pending" | "approved" | "rejected" | "expired";
          moderated_at: string | null;
          moderated_by: string | null;
          created_at: string;
          expires_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["requests"]["Row"], "id" | "created_at" | "expires_at" | "moderated_at" | "moderated_by">;
        Update: Partial<Database["public"]["Tables"]["requests"]["Insert"]>;
      };
      providers: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          bio: string | null;
          whatsapp: string;
          category_id: string;
          bairro_id: string;
          foto_url: string | null;
          highlighted: boolean;
          plan: "free" | "basico" | "premium";
          plan_expires: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["providers"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["providers"]["Insert"]>;
      };
      email_log: {
        Row: {
          id: string;
          to: string;
          template: string;
          request_id: string | null;
          provider_id: string | null;
          sent_at: string;
          status: "sent" | "failed";
          resend_id: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["email_log"]["Row"], "id" | "sent_at">;
        Update: Partial<Database["public"]["Tables"]["email_log"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
