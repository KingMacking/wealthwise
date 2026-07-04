/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accounts from "../accounts.js";
import type * as budgets from "../budgets.js";
import type * as categories from "../categories.js";
import type * as creditCards from "../creditCards.js";
import type * as debug from "../debug.js";
import type * as exportImport from "../exportImport.js";
import type * as goals from "../goals.js";
import type * as movements from "../movements.js";
import type * as paymentMethods from "../paymentMethods.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  budgets: typeof budgets;
  categories: typeof categories;
  creditCards: typeof creditCards;
  debug: typeof debug;
  exportImport: typeof exportImport;
  goals: typeof goals;
  movements: typeof movements;
  paymentMethods: typeof paymentMethods;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
