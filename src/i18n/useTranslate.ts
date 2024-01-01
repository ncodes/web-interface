import { compile, pathToRegexp } from "path-to-regexp";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { logError } from "../libs/helpers";

export default function useTranslate() {
  const { locale: localeParam } = useParams();
  const { t, i18n } = useTranslation("", { lng: localeParam });
  const { pathname } = useLocation();

  useEffect(() => {
    const userSelectedLocale = localeParam || getCachedLocale();
    if (userSelectedLocale && userSelectedLocale !== i18n.language) {
      i18n.changeLanguage(userSelectedLocale).catch(logError);
    }
  }, [i18n, localeParam]);

  /**
   * Generate a locale-aware link
   * @param path The path to link to
   * @param locale The locale to use (defaults to current locale)
   */
  function genLink(path: string, locale = i18n.language) {
    if (path) return `/${locale}${path}`;

    const routeFormat = "/:locale/:path*"; // How routes are structured in the app
    const definePath = compile(routeFormat);

    let subPaths: string[] = [];
    const routeComponents = pathToRegexp(routeFormat).exec(pathname);
    if (routeComponents) {
      if (routeComponents && routeComponents[2]) {
        subPaths = routeComponents[2].split("/");
      }
    }

    return definePath({
      locale,
      path: subPaths.length ? subPaths : undefined,
    });
  }

  /**
   * Cache the locale in local storage
   * @param locale
   */
  function cacheLocale(locale: string) {
    localStorage.setItem("locale", locale);
  }

  /**
   * Get the cached locale
   */
  function getCachedLocale() {
    return localStorage.getItem("locale");
  }

  return { t, i18n, genLink, cacheLocale, getCachedLocale };
}
