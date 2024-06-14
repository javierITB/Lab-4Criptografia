// ==UserScript==
// @name         Descifrador de Mensajes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Desencriptar mensajes de una página web específica
// @match        https://cripto.tiiny.site/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js#sha512-LALALAnOQuvD9nKirvxDdvQ9OMqe2dgapbPB7vYAMrzJihw5m+aNcf0dX53m6YxM4LgA9u8e9eg9QX+/+mPu8kCNpV2A==
// @grant        none
// ==/UserScript==
/* global CryptoJS */
// #sha512-LALALAnOQuvD9nKirvxDdvQ9OMqe2dgapbPB7vYAMrzJihw5m+aNcf0dX53m6YxM4LgA9u8e9eg9QX+/+mPu8kCNpV2A==

(function() {
    'use strict';
    function main() {
        // Esperar a que se cargue CryptoJS y luego ejecutar el código principal
        if (typeof CryptoJS !== "undefined") {
            ejecutarCodigo();
        } else {
            console.error("CryptoJS no está definido. Espere a que se cargue correctamente.");
        }
    }
    function ejecutarCodigo() {
        // Parte 1: Obtener la llave de descifrado
        // Obtener todas las etiquetas <p> dentro del body
        const paragraphs = document.querySelectorAll('body > p');
        // Función para obtener todas las letras mayúsculas de un texto
        function obtenerTodasLasLetrasMayusculas(texto) {
            let letrasMayusculas = '';
            for (let i = 0; i < texto.length; i++) {
                const caracter = texto.charAt(i);
                if (caracter === caracter.toUpperCase() && caracter !== caracter.toLowerCase() && caracter.charCodeAt() >= 65 && caracter.charCodeAt() <= 90) {
                    letrasMayusculas += caracter;
                }
            }
            return letrasMayusculas;
        }
        // Variable para almacenar todas las letras mayúsculas
        let key = '';
        // Iterar sobre cada etiqueta <p>
        paragraphs.forEach(p => {
            // Obtener el texto de la etiqueta <p>
            const texto = p.textContent.trim();

            // Obtener todas las letras mayúsculas del texto y concatenarlas a 'key'
            key += obtenerTodasLasLetrasMayusculas(texto);
        });
        // Mostrar todas las letras mayúsculas encontradas en la consola
        console.log('La llave es:', key);
        // Parte 2: Detectar el patrón de mensajes cifrados y contarlos
        const encryptedMessages = document.querySelectorAll("div[id]");
        console.log("Los mensajes cifrados son: " + encryptedMessages.length);
        // Parte 3: Desencriptar y mostrar los mensajes
        encryptedMessages.forEach((msg, index) => {
            const encryptedText = msg.id;
            // Cambiar de base64 a UTF-8 (no necesario si ya están en UTF-8)
            const decodedText = atob(encryptedText);
            // Desencriptar con la llave
            const decryptedBytes = CryptoJS.TripleDES.decrypt(decodedText, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            console.log(encryptedText + " " + decryptedText);
            // Crear una nueva etiqueta <p> para el mensaje descifrado
            const plainTextNode = document.createElement("p");
            plainTextNode.textContent = decryptedText;
            // Insertar la nueva etiqueta <p> al final del body
            document.body.appendChild(plainTextNode);
        });
    }
    // Esperar a que se cargue todo el contenido de la página y las librerías
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

