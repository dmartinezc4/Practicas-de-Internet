import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";

import { multiplicar } from "./main2.ts";
   
Deno.test(function addTest() {
  assertEquals(multiplicar([1,2,3]), [6,3,2]);
});

Deno.test(function addTest() {
  assertEquals(multiplicar(["1","2","3"]), [6,3,2]);
});

Deno.test(function addTest() {
  assertEquals(multiplicar([[1,2],3]), [6,3,2]);
});
