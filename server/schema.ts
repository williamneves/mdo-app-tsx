import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Codigos Sequenciais
 *
 *
 */
export interface SaleNumber extends SanityDocument {
  _type: "saleNumber";

  /**
   * Número da Venda — `number`
   *
   *
   */
  saleNumber?: number;

  /**
   * Código do Cliente — `number`
   *
   *
   */
  clientNumber?: number;
}

/**
 * User
 *
 *
 */
export interface User extends SanityDocument {
  _type: "user";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Auth User — `string`
   *
   *
   */
  authUID?: string;

  /**
   * Auth Provider — `array`
   *
   *
   */
  provider?: Array<SanityKeyed<string>>;

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Email — `string`
   *
   *
   */
  email?: string;

  /**
   * Image URL — `string`
   *
   *
   */
  imageURL?: string;

  /**
   * Image Asset — `image`
   *
   *
   */
  imageAsset?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * User Role — `string`
   *
   *
   */
  role?:
    | "admin"
    | "manager"
    | "coordinator"
    | "vendor"
    | "streetVendor"
    | "client";

  /**
   * Profile — `object`
   *
   *
   */
  profile?: {
    _type: "profile";
    /**
     * Job Title — `string`
     *
     *
     */
    jobTitle?: string;

    /**
     * Birthday — `date`
     *
     *
     */
    birthday?: string;

    /**
     * Gender — `string`
     *
     *
     */
    gender?: string;

    /**
     * Phone Number — `string`
     *
     *
     */
    phoneNumber?: string;

    /**
     * Bio — `text`
     *
     *
     */
    bio?: string;
  };

  /**
   * Address — `object`
   *
   *
   */
  address?: {
    _type: "address";
    /**
     * Address — `string`
     *
     *
     */
    address?: string;

    /**
     * Number — `string`
     *
     *
     */
    number?: string;

    /**
     * City — `string`
     *
     *
     */
    city?: string;

    /**
     * State — `string`
     *
     *
     */
    state?: string;

    /**
     * Zip Code — `string`
     *
     *
     */
    zipCode?: string;

    /**
     * Description — `text`
     *
     *
     */
    description?: string;
  };

  /**
   * Bank Account — `object`
   *
   *
   */
  bankAccount?: {
    _type: "bankAccount";
    /**
     * CPF — `string`
     *
     *
     */
    cpf?: string;

    /**
     * Bank Name — `string`
     *
     *
     */
    bankName?: string;

    /**
     * Account Number — `string`
     *
     *
     */
    accountNumber?: string;

    /**
     * Routing Number — `string`
     *
     *
     */
    routingNumber?: string;

    /**
     * Account Type — `string`
     *
     *
     */
    accountType?: string;

    /**
     * Chave Pix — `string`
     *
     *
     */
    chavePix?: string;

    /**
     * Tipo da Chave Pix — `string`
     *
     *
     */
    tipoChavePix?: string;
  };
}

/**
 * Store
 *
 *
 */
export interface Store extends SanityDocument {
  _type: "store";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Store Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Store Tax ID — `string`
   *
   *
   */
  taxID?: string;

  /**
   * Store Managers — `array`
   *
   *
   */
  managers?: Array<SanityKeyedReference<User>>;

  /**
   * Store Employees — `array`
   *
   *
   */
  employees?: Array<SanityKeyedReference<User>>;

  /**
   * Store Image — `image`
   *
   *
   */
  imageURL?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Address — `object`
   *
   *
   */
  address?: {
    _type: "address";
    /**
     * Street — `string`
     *
     *
     */
    street?: string;

    /**
     * Number — `string`
     *
     *
     */
    number?: string;

    /**
     * Complement — `text`
     *
     *
     */
    complement?: string;

    /**
     * City — `string`
     *
     *
     */
    city?: string;

    /**
     * State — `string`
     *
     *
     */
    state?: string;

    /**
     * Zip Code — `string`
     *
     *
     */
    zipCode?: string;
  };
}

/**
 * Bank Account
 *
 *
 */
export interface BankAccount extends SanityDocument {
  _type: "bankAccount";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Bank Name — `string`
   *
   *
   */
  bankName?: string;

  /**
   * Account Number — `string`
   *
   *
   */
  accountNumber?: string;

  /**
   * Routing Number — `string`
   *
   *
   */
  routingNumber?: string;

  /**
   * Account Type — `string`
   *
   *
   */
  accountType?: "checking" | "savings";

  /**
   * Store — `reference`
   *
   *
   */
  store?: SanityReference<Store>;
}

/**
 * Payment Method
 *
 *
 */
export interface PaymentMethod extends SanityDocument {
  _type: "paymentMethod";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `string`
   *
   *
   */
  description?: string;

  /**
   * Payment Type — `string`
   *
   *
   */
  paymentType?:
    | "creditCard"
    | "debitCard"
    | "cash"
    | "installment"
    | "pix"
    | "ted"
    | "other";

  /**
   * Store — `reference`
   *
   *
   */
  store?: SanityReference<Store>;

  /**
   * Bank Account — `reference`
   *
   *
   */
  bankAccount?: SanityReference<BankAccount>;
}

/**
 * Product
 *
 *
 */
export interface Product extends SanityDocument {
  _type: "product";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `string`
   *
   *
   */
  description?: string;

  /**
   * Product SKU — `string`
   *
   *
   */
  sku?: string;

  /**
   * Category — `string`
   *
   *
   */
  category?: "armacao-grau" | "oculos-solar" | "lente" | "outros";

  /**
   * Store — `reference`
   *
   *
   */
  store?: SanityReference<Store>;
}

/**
 * Origin
 *
 *
 */
export interface Origin extends SanityDocument {
  _type: "origin";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Display Name — `string`
   *
   *
   */
  displayName?: string;

  /**
   * Name — `string`
   *
   *
   */
  name?: string;
}

/**
 * Client
 *
 *
 */
export interface Client extends SanityDocument {
  _type: "client";

  /**
   * Inativado — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Criado em — `string`
   *
   *
   */
  createdAt?: string;

  /**
   * Código do Cliente — `number`
   *
   *
   */
  clientNumber?: number;

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Phone — `string`
   *
   *
   */
  phone?: string;

  /**
   * Email — `string`
   *
   *
   */
  email?: string;

  /**
   * Birthday — `date`
   *
   *
   */
  birthday?: string;

  /**
   * Gender — `string`
   *
   *
   */
  gender?: string;

  /**
   * How did you hear about us? — `string`
   *
   *
   */
  hearAboutUs?: string;

  /**
   * CPF — `string`
   *
   *
   */
  cpf?: string;

  /**
   * Store — `reference`
   *
   *
   */
  store?: SanityReference<Store>;

  /**
   * Created By — `reference`
   *
   *
   */
  createdBy?: SanityReference<User>;

  /**
   * Address — `object`
   *
   *
   */
  address?: {
    _type: "address";
    /**
     * Street — `string`
     *
     *
     */
    street?: string;

    /**
     * Number — `string`
     *
     *
     */
    number?: string;

    /**
     * Complement — `string`
     *
     *
     */
    complement?: string;

    /**
     * City — `string`
     *
     *
     */
    city?: string;

    /**
     * State — `string`
     *
     *
     */
    state?: string;

    /**
     * Zip Code — `string`
     *
     *
     */
    zipCode?: string;
  };
}

/**
 * Metas
 *
 *
 */
export interface Goal extends SanityDocument {
  _type: "goal";

  /**
   * Inactive — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Deleted — `boolean`
   *
   *
   */
  deleted?: boolean;

  /**
   * Meta Principal? — `boolean`
   *
   *
   */
  mainStoreGoal?: boolean;

  /**
   * Goal Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Goal Description — `string`
   *
   *
   */
  description?: string;

  /**
   * Período da Meta — `object`
   *
   *
   */
  goalRange?: {
    _type: "goalRange";
    /**
     * Data de Início — `date`
     *
     *
     */
    dateStart?: string;

    /**
     * Data de Término — `date`
     *
     *
     */
    dateEnd?: string;
  };

  /**
   * Tipo de Meta — `string`
   *
   *
   */
  type?: "store" | "product" | "group" | "individual";

  /**
   * Categoria — `string`
   *
   *
   */
  category?:
    | "dateRangeGoals"
    | "monthlyGoals"
    | "weeklyGoals"
    | "dailyGoals"
    | "specialGoals";

  /**
   * Tabela de Referência — `string`
   *
   * Nome (_type) da tabela de referência
   */
  typeReference?: string;

  /**
   * Key de Referência — `string`
   *
   * Caminho para a key de referência
   */
  keyReferencePath?: string;

  /**
   * Valores Alvos — `array`
   *
   *
   */
  targetValues?: Array<
    SanityKeyed<{
      /**
       * Valor — `number`
       *
       *
       */
      value?: number;

      /**
       * Descrição — `string`
       *
       *
       */
      description?: string;
    }>
  >;

  /**
   * Lojas Alvo — `array`
   *
   *
   */
  targetStores?: Array<SanityKeyedReference<Store>>;
}

/**
 * Sale
 *
 *
 */
export interface Sale extends SanityDocument {
  _type: "sale";

  /**
   * Sale Number — `number`
   *
   *
   */
  saleNumber?: number;

  /**
   * PDV Number — `string`
   *
   *
   */
  PDVNumber?: string;

  /**
   * FeedBack de Auditoria — `string`
   *
   *
   */
  auditFeedBack?: string;

  /**
   * Status de Auditoria — `string`
   *
   *
   */
  auditStatus?: "pending" | "approved" | "rejected";

  /**
   * Cancelado — `boolean`
   *
   *
   */
  canceled?: boolean;

  /**
   * Excluído pelo Usuário — `boolean`
   *
   *
   */
  excluded?: boolean;

  /**
   * Date — `date`
   *
   *
   */
  date?: string;

  /**
   * Client — `reference`
   *
   *
   */
  client?: SanityReference<Client>;

  /**
   * Products — `array`
   *
   *
   */
  products?: Array<
    SanityKeyed<{
      /**
       * Product — `reference`
       *
       *
       */
      product?: SanityReference<Product>;

      /**
       * Price — `number`
       *
       *
       */
      price?: number;

      /**
       * Quantity — `number`
       *
       *
       */
      quantity?: number;

      /**
       * Discount — `number`
       *
       *
       */
      discount?: number;

      /**
       * Cost — `number`
       *
       *
       */
      cost?: number;
    }>
  >;

  /**
   * Payments — `array`
   *
   *
   */
  salePayments?: Array<
    SanityKeyed<{
      /**
       * Payment Method — `reference`
       *
       *
       */
      paymentMethod?: SanityReference<PaymentMethod>;

      /**
       * Payment Amount — `number`
       *
       *
       */
      paymentAmount?: number;

      /**
       * Split Quantity — `number`
       *
       *
       */
      splitQuantity?: number;
    }>
  >;

  /**
   * Total Price — `number`
   *
   *
   */
  totalPrice?: number;

  /**
   * Total Cost — `number`
   *
   *
   */
  totalCost?: number;

  /**
   * Total Discount — `number`
   *
   *
   */
  totalDiscount?: number;

  /**
   * Total Quantity — `number`
   *
   *
   */
  totalQuantity?: number;

  /**
   * Sale Amount — `number`
   *
   *
   */
  saleAmount?: number;

  /**
   * Lucro — `number`
   *
   *
   */
  profit?: number;

  /**
   * Markup — `number`
   *
   *
   */
  markup?: number;

  /**
   * Score — `number`
   *
   *
   */
  score?: number;

  /**
   * Payment Method — `reference`
   *
   *
   */
  paymentMethod?: SanityReference<PaymentMethod>;

  /**
   * Split quantity — `number`
   *
   *
   */
  splitQuantity?: number;

  /**
   * User — `reference`
   *
   *
   */
  user?: SanityReference<User>;

  /**
   * Store — `reference`
   *
   *
   */
  store?: SanityReference<Store>;

  /**
   * Origin — `array`
   *
   *
   */
  userReferrer?: Array<SanityKeyedReference<Origin>>;

  /**
   * Schedule — `boolean`
   *
   *
   */
  schedule?: boolean;

  /**
   * Schedule Discounted — `boolean`
   *
   *
   */
  scheduleDiscount?: boolean;

  /**
   * Observations — `text`
   *
   *
   */
  observations?: string;
}

/**
 * Bônus
 *
 *
 */
export interface Bonus extends SanityDocument {
  _type: "bonus";

  /**
   * Inativo — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Excluído pelo usuário — `boolean`
   *
   *
   */
  deleted?: boolean;

  /**
   * status — `string`
   *
   *
   */
  status?: "draft" | "posted" | "paid";

  /**
   * Nome da Comissão — `string`
   *
   *
   */
  name?: string;

  /**
   * Descrição da Comissão — `text`
   *
   *
   */
  description?: string;

  /**
   * Período da Comissão — `object`
   *
   *
   */
  bonusRange?: {
    _type: "bonusRange";
    /**
     * Data de Início — `date`
     *
     *
     */
    dateStart?: string;

    /**
     * Data de Término — `date`
     *
     *
     */
    dateEnd?: string;
  };

  /**
   * Tipo de Comissão — `string`
   *
   *
   */
  paymentType?: "cash" | "points" | "others";

  /**
   * Lançamentos — `array`
   *
   *
   */
  bonusEntries?: Array<
    SanityKeyed<{
      /**
       * Tipo de Lançamento — `string`
       *
       *
       */
      type?:
        | "sales"
        | "clientsTaken"
        | "appointmentsCreated"
        | "shareBonus"
        | "managerBonus"
        | "others"
        | "healthCare"
        | "generalDiscount";

      /**
       * Descrição do Lançamento — `text`
       *
       *
       */
      description?: string;

      /**
       * Tipo de Operação — `string`
       *
       *
       */
      operation?: "add" | "subtract";

      /**
       * Valor do Lançamento — `number`
       *
       *
       */
      value?: number;
    }>
  >;

  /**
   * Valor Final da Comissão — `number`
   *
   *
   */
  bonusAmount?: number;

  /**
   * Meta Relacionada — `reference`
   *
   *
   */
  goal?: SanityReference<Goal>;

  /**
   * Usuário — `reference`
   *
   *
   */
  user?: SanityReference<User>;

  /**
   * Loja — `reference`
   *
   *
   */
  store?: SanityReference<Store>;
}

/**
 * Relatório Diário do Street
 *
 *
 */
export interface StreetDailyReport extends SanityDocument {
  _type: "streetDailyReport";

  /**
   * Inativo — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Excluído — `boolean`
   *
   *
   */
  excluded?: boolean;

  /**
   * Data do Relatório — `date`
   *
   *
   */
  reportDate?: string;

  /**
   * Reportado por — `reference`
   *
   *
   */
  reporter?: SanityReference<User>;

  /**
   * FeedBack de Auditoria — `string`
   *
   *
   */
  auditFeedBack?: string;

  /**
   * Status de Auditoria — `string`
   *
   *
   */
  auditStatus?: "pending" | "approved" | "rejected";

  /**
   * Clientes Abordados — `number`
   *
   *
   */
  clientsApproached?: number;

  /**
   * Clientes Cadastrados — `array`
   *
   *
   */
  clientsRegistered?: Array<SanityKeyedReference<Client>>;

  /**
   * Consultas Agendadas — `number`
   *
   *
   */
  scheduledAppointments?: number;

  /**
   * Relatório de Atividades — `string`
   *
   *
   */
  activitiesReport?: string;

  /**
   * Store — `reference`
   *
   *
   */
  store?: SanityReference<Store>;
}

/**
 * FAQ Post
 *
 *
 */
export interface FaqPost extends SanityDocument {
  _type: "faqPost";

  /**
   * Inactive — `boolean`
   *
   *
   */
  inactive?: boolean;

  /**
   * Question — `string`
   *
   *
   */
  question?: string;

  /**
   * Description — `string`
   *
   *
   */
  description?: string;

  /**
   * Thumbnail — `image`
   *
   *
   */
  thumbnail?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Answer — `array`
   *
   *
   */
  answer?: Array<
    | SanityKeyed<SanityBlock>
    | SanityKeyed<{
        _type: "image";
        asset: SanityReference<SanityImageAsset>;
        crop?: SanityImageCrop;
        hotspot?: SanityImageHotspot;
      }>
  >;

  /**
   * Category — `array`
   *
   *
   */
  category?: Array<SanityKeyed<string>>;

  /**
   * Tags — `array`
   *
   *
   */
  tags?: Array<SanityKeyed<string>>;
}

export type Documents =
  | SaleNumber
  | User
  | Store
  | BankAccount
  | PaymentMethod
  | Product
  | Origin
  | Client
  | Goal
  | Sale
  | Bonus
  | StreetDailyReport
  | FaqPost;
