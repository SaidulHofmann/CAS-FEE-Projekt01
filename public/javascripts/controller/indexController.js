"use strict";
/**
 * Project: HSR CAS FEE 2017, Project 01 - notes application.
 * Content: Controller functionality for the notes application.
 * Created on: 12.10.2017
 * Author: Saidul Hofmann
 */

import {LocationEnum, SortFieldEnum} from "../services/coreTypes.js";
import {Model} from "../model.js";
import {EditNoteController} from "./editNoteController.js";
import {ListNotesController} from "./listNotesController.js";
import {RestClient} from "../services/restClient.js";
import {User} from "../services/coreTypes.js";


/**
 * Handles user inputs and routing. Mediates between view and business logic.
 */
class IndexController {
    constructor(objModel) {

        this.relativeRootPath = "../";
        this.styleSheetStorageName = "StyleSheetStorage";
        this.model = objModel;
        this.restClient = new RestClient();

        // State
        this.currentStyleSheet = this.getLastSelectedStylesheet();
        this.currentUser = null;

        // Controllers
        this.listNotesCtr = new ListNotesController(this);
        this.editNoteCtr = new EditNoteController(this);

        this.init();
    }

    init() {
        window.addEventListener("hashchange", this.renderCurrentLocation.bind(this));
        this.setDefaultText();
        this.setPartialRenderers();
        this.renderUI();
        // this.renderPartialView(LocationEnum.LIST_NOTES, null);
    }

    // -------------------------------------------------------------------------
    // Getters / Setters
    // -------------------------------------------------------------------------

    setDefaultText() {
        this.headerTextDefault = "Notizen Verwaltung - CAS Projekt 01";
        this.sidebarTextNotesListing = `Erstellen Sie eine neue Notiz mit dem Button "Neue Notiz erstellen".\n
        Ändern Sie eine angezeigte Notiz mit dem Button "Ändern".`;
        this.sidebarTextNotesEditing = `Passen Sie die Angaben nach Ihre Wünschen an und speichern Sie die Notiz mit dem "Speichern" Button.`;
        this.sidebarTextLogin = "Melden Sie sich mit dem 'Login' Button an, um Ihre Notizen zu verwalten.";
        this.footerTextDefault = "\u00A9 2017 Saidul Hofmann";
    }

    setPartialRenderers() {
        let menu01Template = document.getElementById("menu01-template").innerHTML;
        this.menu01Renderer = Handlebars.compile(menu01Template);

        let menu02Template = document.getElementById("menu02-template").innerHTML;
        this.menu02Renderer = Handlebars.compile(menu02Template);
    }

    getStyleSheetLink() {
        return document.getElementById("lnkDefaultStyleSheet");
    }

    setStyleSheet(strStyleSheetName) {
        this.getStyleSheetLink().href = strStyleSheetName;
        if (this.getStyleSheetDropdown()) {
            this.setStyleSheetDropdownValue(strStyleSheetName);
        }
    }

    getStyleSheetDropdown() {
        return document.getElementById('drpSelectStyle');
    }

    setStyleSheetDropdownValue(strStyleSheetName) {
        if (strStyleSheetName) {
            document.getElementById('drpSelectStyle').value = strStyleSheetName;
        }
    }

    setSelectedStyleSheet() {
        this.setStyleSheet(this.getStyleSheetDropdown().value);
        return this.getStyleSheetDropdown().value;
    }

    setSidebarText(strSidebarText) {
        if (strSidebarText) {
            document.querySelector(".sidebar").innerText = strSidebarText;
        }
    }

    getBtnCreateNewNote() {
        return document.getElementById('btnCreateNewNote');
    }

    getBtnLogin() {
        return document.getElementById('btnLogin');
    }

    getBtnLogout() {
        return document.getElementById('btnLogout');
    }

    //-------------------------------------------------------------------------
    // Routing
    //-------------------------------------------------------------------------

    renderPartialView(strLocationEnum, params) {
        history.pushState(null, strLocationEnum, strLocationEnum);
        this.renderCurrentLocation(params);
    }

    renderCurrentLocation(params) {
        let currentLocationHash = location.hash || "#home";

        switch (currentLocationHash) {
            case LocationEnum.LOGIN:
                this.renderLoginView();
                break;
            case LocationEnum.LIST_NOTES:
                this.renderListNotesView();
                break;
            case LocationEnum.EDIT_NOTE:
                this.renderEditNoteView(params);
                break;
            default:
                console.log("Aktuelle location: '" + currentLocationHash + "' ist unbekannt.");
                break;
        }
    }

    renderLoginView() {
        this.setSidebarText(this.sidebarTextLogin);
        this.listNotesCtr.renderUI(this.currentUser);
    }

    renderListNotesView() {
        //this.listNotesCtr.renderUI(this.model.getNotesView());
        this.setSidebarText(this.sidebarTextNotesListing);
        this.listNotesCtr.renderUI(this.currentUser);
    }

    renderEditNoteView(params) {
        this.setSidebarText(this.sidebarTextNotesEditing);
        this.editNoteCtr.renderUI(params);
    }

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    addEventHandlersForIndexPage() {
        this.getBtnCreateNewNote().onclick = this.onBtnCreateNewNote_Click.bind(this);
        this.getStyleSheetDropdown().onchange = this.onDrpSelectStyle_Change.bind(this);
        this.getBtnLogin().onclick = this.onBtnLogin_Click.bind(this);
        this.getBtnLogout().onclick = this.onBtnLogout_Click.bind(this);
    }

    removeEventHandlersForIndexPage() {
        // Not necessary.
    }

    onBtnCreateNewNote_Click() {
        this.renderPartialView(LocationEnum.EDIT_NOTE);
    }

    onDrpSelectStyle_Change() {
        let selectedStyleSheet = this.setSelectedStyleSheet();
        this.model.persistStyleSheet(this.styleSheetStorageName, selectedStyleSheet);
        this.currentStyleSheet = selectedStyleSheet;
    }

    async onBtnLogin_Click() {
        this.currentUser = await this.restClient.login("admin@admin.ch", "123456");
        this.updateLoginStatus();
        this.renderListNotesView();
    }

    onBtnLogout_Click() {
        this.restClient.logout(this.currentUser).then(() => {
            this.updateLoginStatus();
            this.renderPartialView(LocationEnum.LOGIN);
        });
    }

    updateLoginStatus() {
        let isLoggedIn = this.restClient.isLoggedIn(this.currentUser);
        $(".logged-out").toggle(!isLoggedIn);
        $(".logged-in").toggle(isLoggedIn);
    }

    //-------------------------------------------------------------------------
    // Additional Methods
    //-------------------------------------------------------------------------

    getLastSelectedStylesheet() {
        if (this.currentStyleSheet) {
            return this.currentStyleSheet;
        } else {
            let styleSheetPath = this.restClient.loadStylesheet(this.styleSheetStorageName);
            if (styleSheetPath) {
                return styleSheetPath;
            } else {
                return this.relativeRootPath + "stylesheets/default.css";
            }
        }
    }

    renderUI() {
        document.querySelector(".header").innerText = this.headerTextDefault;
        document.querySelector(".menu01").innerHTML = this.menu01Renderer();
        document.querySelector(".menu02").innerHTML = this.menu02Renderer();
        document.querySelector(".footer").innerText = this.footerTextDefault;

        this.setStyleSheet(this.getLastSelectedStylesheet());
        this.setStyleSheetDropdownValue(this.currentStyleSheet);
        this.addEventHandlersForIndexPage();

        this.updateLoginStatus();
        this.renderLoginView()
    }
}



//-------------------------------------------------------------------------
// Main entry point for the application.
//-------------------------------------------------------------------------

window.onload = function () {

    console.log("window.onload started.");

    const model = new Model();
    const controller = new IndexController(model);

};
