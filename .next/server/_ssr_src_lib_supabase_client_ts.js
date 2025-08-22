/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_src_lib_supabase_client_ts";
exports.ids = ["_ssr_src_lib_supabase_client_ts"];
exports.modules = {

/***/ "?32c4":
/*!****************************!*\
  !*** bufferutil (ignored) ***!
  \****************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?66e9":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "(ssr)/./src/lib/supabase/client.ts":
/*!************************************!*\
  !*** ./src/lib/supabase/client.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createClient: () => (/* binding */ createClient),\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_ssr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/ssr */ \"(ssr)/./node_modules/@supabase/ssr/dist/module/index.js\");\n\n// Fallback values for build time when real credentials aren't available\nconst FALLBACK_URL = \"https://placeholder.supabase.co\";\nconst FALLBACK_ANON_KEY = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI3MjAsImV4cCI6MTk2MDc2ODcyMH0.placeholder\";\nconst createClient = ()=>{\n    const url = \"https://txwjfzlnmydonxvdtmqp.supabase.co\" || 0;\n    const anonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d2pmemxubXlkb254dmR0bXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODU0ODksImV4cCI6MjA2OTk2MTQ4OX0.iSxEdaO2mYH_nRi5l9KqPX9BIOWDdQVlchi_WMkZIxs\" || 0;\n    // Debug environment variable loading\n    console.log(\"\\uD83D\\uDD27 Supabase Client Configuration:\");\n    console.log(\"  URL from env:\",  true ? \"✅ Found\" : 0);\n    console.log(\"  Anon Key from env:\",  true ? \"✅ Found\" : 0);\n    console.log(\"  Using URL:\", url.includes(\"placeholder\") ? \"❌ FALLBACK\" : \"✅ Real\");\n    console.log(\"  Using Anon Key:\", anonKey.includes(\"placeholder\") ? \"❌ FALLBACK\" : \"✅ Real\");\n    if (url.includes(\"placeholder\") || anonKey.includes(\"placeholder\")) {\n        console.error(\"\\uD83D\\uDEA8 CRITICAL: Supabase client using fallback credentials - authentication will fail!\");\n    }\n    return (0,_supabase_ssr__WEBPACK_IMPORTED_MODULE_0__.createBrowserClient)(url, anonKey);\n};\n// Export a singleton instance for client-side usage\nconst supabase = createClient();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbGliL3N1cGFiYXNlL2NsaWVudC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBbUQ7QUFFbkQsd0VBQXdFO0FBQ3hFLE1BQU1DLGVBQWU7QUFDckIsTUFBTUMsb0JBQW9CO0FBRW5CLE1BQU1DLGVBQWU7SUFDMUIsTUFBTUMsTUFBTUMsMENBQW9DLElBQUlKLENBQVlBO0lBQ2hFLE1BQU1PLFVBQVVILGtOQUF5QyxJQUFJSCxDQUFpQkE7SUFFOUUscUNBQXFDO0lBQ3JDUSxRQUFRQyxHQUFHLENBQUM7SUFDWkQsUUFBUUMsR0FBRyxDQUFDLG1CQUFtQk4sS0FBb0MsR0FBRyxZQUFZO0lBQ2xGSyxRQUFRQyxHQUFHLENBQUMsd0JBQXdCTixLQUF5QyxHQUFHLFlBQVk7SUFDNUZLLFFBQVFDLEdBQUcsQ0FBQyxnQkFBZ0JQLElBQUlRLFFBQVEsQ0FBQyxpQkFBaUIsZUFBZTtJQUN6RUYsUUFBUUMsR0FBRyxDQUFDLHFCQUFxQkgsUUFBUUksUUFBUSxDQUFDLGlCQUFpQixlQUFlO0lBRWxGLElBQUlSLElBQUlRLFFBQVEsQ0FBQyxrQkFBa0JKLFFBQVFJLFFBQVEsQ0FBQyxnQkFBZ0I7UUFDbEVGLFFBQVFHLEtBQUssQ0FBQztJQUNoQjtJQUVBLE9BQU9iLGtFQUFtQkEsQ0FBQ0ksS0FBS0k7QUFDbEMsRUFBQztBQUVELG9EQUFvRDtBQUM3QyxNQUFNTSxXQUFXWCxlQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2FtdW5pdHktZmluYWwvLi9zcmMvbGliL3N1cGFiYXNlL2NsaWVudC50cz8wZjk3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUJyb3dzZXJDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3NyJ1xuXG4vLyBGYWxsYmFjayB2YWx1ZXMgZm9yIGJ1aWxkIHRpbWUgd2hlbiByZWFsIGNyZWRlbnRpYWxzIGFyZW4ndCBhdmFpbGFibGVcbmNvbnN0IEZBTExCQUNLX1VSTCA9ICdodHRwczovL3BsYWNlaG9sZGVyLnN1cGFiYXNlLmNvJ1xuY29uc3QgRkFMTEJBQ0tfQU5PTl9LRVkgPSAnZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5Cc1lXTmxhRzlzWkdWeUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUyTkRVeE9USTNNakFzSW1WNGNDSTZNVGsyTURjMk9EY3lNSDAucGxhY2Vob2xkZXInXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDbGllbnQgPSAoKSA9PiB7XG4gIGNvbnN0IHVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCB8fCBGQUxMQkFDS19VUkxcbiAgY29uc3QgYW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIHx8IEZBTExCQUNLX0FOT05fS0VZXG4gIFxuICAvLyBEZWJ1ZyBlbnZpcm9ubWVudCB2YXJpYWJsZSBsb2FkaW5nXG4gIGNvbnNvbGUubG9nKCfwn5SnIFN1cGFiYXNlIENsaWVudCBDb25maWd1cmF0aW9uOicpXG4gIGNvbnNvbGUubG9nKCcgIFVSTCBmcm9tIGVudjonLCBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwgPyAn4pyFIEZvdW5kJyA6ICfinYwgTWlzc2luZycpXG4gIGNvbnNvbGUubG9nKCcgIEFub24gS2V5IGZyb20gZW52OicsIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZID8gJ+KchSBGb3VuZCcgOiAn4p2MIE1pc3NpbmcnKVxuICBjb25zb2xlLmxvZygnICBVc2luZyBVUkw6JywgdXJsLmluY2x1ZGVzKCdwbGFjZWhvbGRlcicpID8gJ+KdjCBGQUxMQkFDSycgOiAn4pyFIFJlYWwnKVxuICBjb25zb2xlLmxvZygnICBVc2luZyBBbm9uIEtleTonLCBhbm9uS2V5LmluY2x1ZGVzKCdwbGFjZWhvbGRlcicpID8gJ+KdjCBGQUxMQkFDSycgOiAn4pyFIFJlYWwnKVxuICBcbiAgaWYgKHVybC5pbmNsdWRlcygncGxhY2Vob2xkZXInKSB8fCBhbm9uS2V5LmluY2x1ZGVzKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgY29uc29sZS5lcnJvcign8J+aqCBDUklUSUNBTDogU3VwYWJhc2UgY2xpZW50IHVzaW5nIGZhbGxiYWNrIGNyZWRlbnRpYWxzIC0gYXV0aGVudGljYXRpb24gd2lsbCBmYWlsIScpXG4gIH1cbiAgXG4gIHJldHVybiBjcmVhdGVCcm93c2VyQ2xpZW50KHVybCwgYW5vbktleSlcbn1cblxuLy8gRXhwb3J0IGEgc2luZ2xldG9uIGluc3RhbmNlIGZvciBjbGllbnQtc2lkZSB1c2FnZVxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KClcbiJdLCJuYW1lcyI6WyJjcmVhdGVCcm93c2VyQ2xpZW50IiwiRkFMTEJBQ0tfVVJMIiwiRkFMTEJBQ0tfQU5PTl9LRVkiLCJjcmVhdGVDbGllbnQiLCJ1cmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwiYW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiY29uc29sZSIsImxvZyIsImluY2x1ZGVzIiwiZXJyb3IiLCJzdXBhYmFzZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./src/lib/supabase/client.ts\n");

/***/ })

};
;