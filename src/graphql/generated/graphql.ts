import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AttributeWithCategory = {
  attribute: Scalars['String'];
  category: Scalars['String'];
};

export type PaginationMeta = {
  __typename?: 'PaginationMeta';
  count: Scalars['Int'];
  offset: Scalars['Int'];
  total: Scalars['Int'];
};

export type Product = {
  __typename?: 'Product';
  attributes?: Maybe<Array<ProductAttribute>>;
  categories?: Maybe<Array<ProductCategory>>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
  rating?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  category?: Maybe<ProductAttributeCategory>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type ProductAttributeCategory = {
  __typename?: 'ProductAttributeCategory';
  attributes?: Maybe<Array<ProductAttribute>>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
};

export type ProductCategoryHierarchyItem = {
  __typename?: 'ProductCategoryHierarchyItem';
  children?: Maybe<Array<ProductCategoryHierarchyItem>>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
};

export type ProductResult = {
  __typename?: 'ProductResult';
  product?: Maybe<Product>;
};

export type ProductsPaginatedResult = {
  __typename?: 'ProductsPaginatedResult';
  meta: PaginationMeta;
  products: Array<Product>;
};

export type Query = {
  __typename?: 'Query';
  allCategories?: Maybe<Array<ProductCategory>>;
  categoryPath?: Maybe<Array<ProductCategory>>;
  product?: Maybe<Product>;
  productAttributesCategories?: Maybe<Array<ProductAttributeCategory>>;
  products?: Maybe<ProductsPaginatedResult>;
};


export type QueryCategoryPathArgs = {
  category: Scalars['String'];
};


export type QueryProductArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryProductAttributesCategoriesArgs = {
  category: Scalars['String'];
};


export type QueryProductsArgs = {
  attributes?: InputMaybe<Array<AttributeWithCategory>>;
  category?: InputMaybe<Scalars['String']>;
  count?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AttributeWithCategory: AttributeWithCategory;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  PaginationMeta: ResolverTypeWrapper<PaginationMeta>;
  Product: ResolverTypeWrapper<Product>;
  ProductAttribute: ResolverTypeWrapper<ProductAttribute>;
  ProductAttributeCategory: ResolverTypeWrapper<ProductAttributeCategory>;
  ProductCategory: ResolverTypeWrapper<ProductCategory>;
  ProductCategoryHierarchyItem: ResolverTypeWrapper<ProductCategoryHierarchyItem>;
  ProductResult: ResolverTypeWrapper<ProductResult>;
  ProductsPaginatedResult: ResolverTypeWrapper<ProductsPaginatedResult>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AttributeWithCategory: AttributeWithCategory;
  Boolean: Scalars['Boolean'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  PaginationMeta: PaginationMeta;
  Product: Product;
  ProductAttribute: ProductAttribute;
  ProductAttributeCategory: ProductAttributeCategory;
  ProductCategory: ProductCategory;
  ProductCategoryHierarchyItem: ProductCategoryHierarchyItem;
  ProductResult: ProductResult;
  ProductsPaginatedResult: ProductsPaginatedResult;
  Query: {};
  String: Scalars['String'];
};

export type PaginationMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginationMeta'] = ResolversParentTypes['PaginationMeta']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  attributes?: Resolver<Maybe<Array<ResolversTypes['ProductAttribute']>>, ParentType, ContextType>;
  categories?: Resolver<Maybe<Array<ResolversTypes['ProductCategory']>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductAttributeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductAttribute'] = ResolversParentTypes['ProductAttribute']> = {
  category?: Resolver<Maybe<ResolversTypes['ProductAttributeCategory']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductAttributeCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductAttributeCategory'] = ResolversParentTypes['ProductAttributeCategory']> = {
  attributes?: Resolver<Maybe<Array<ResolversTypes['ProductAttribute']>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductCategory'] = ResolversParentTypes['ProductCategory']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductCategoryHierarchyItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductCategoryHierarchyItem'] = ResolversParentTypes['ProductCategoryHierarchyItem']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['ProductCategoryHierarchyItem']>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductResult'] = ResolversParentTypes['ProductResult']> = {
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductsPaginatedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductsPaginatedResult'] = ResolversParentTypes['ProductsPaginatedResult']> = {
  meta?: Resolver<ResolversTypes['PaginationMeta'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allCategories?: Resolver<Maybe<Array<ResolversTypes['ProductCategory']>>, ParentType, ContextType>;
  categoryPath?: Resolver<Maybe<Array<ResolversTypes['ProductCategory']>>, ParentType, ContextType, RequireFields<QueryCategoryPathArgs, 'category'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryProductArgs>>;
  productAttributesCategories?: Resolver<Maybe<Array<ResolversTypes['ProductAttributeCategory']>>, ParentType, ContextType, RequireFields<QueryProductAttributesCategoriesArgs, 'category'>>;
  products?: Resolver<Maybe<ResolversTypes['ProductsPaginatedResult']>, ParentType, ContextType, Partial<QueryProductsArgs>>;
};

export type Resolvers<ContextType = any> = {
  PaginationMeta?: PaginationMetaResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductAttribute?: ProductAttributeResolvers<ContextType>;
  ProductAttributeCategory?: ProductAttributeCategoryResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  ProductCategoryHierarchyItem?: ProductCategoryHierarchyItemResolvers<ContextType>;
  ProductResult?: ProductResultResolvers<ContextType>;
  ProductsPaginatedResult?: ProductsPaginatedResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

