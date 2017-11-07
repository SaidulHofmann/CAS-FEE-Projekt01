"use strict";
/**
* Project: HSR CAS FEE 2017, Project 01 - notes application.
* Content: Controller functionality for the notes application.
* Created on: 12.10.2017
* Author: Saidul Hofmann
*/

import { LocationEnum, SortFieldEnum } from "../services/coreTtypes.js";
import { Model } from "../model.js";
import { EditNoteController } from "./editNoteController.js";
import { ListNotesController } from "./listNotesController.js";
import { RestClient } from "../services/restClient.js";


/**
 * Handles user inputs and routing. Mediates between view and business logic.
 */
class IndexController {
    constructor(objModel) {

        this.relativeRootPath = "../";
        this.model = objModel;
        this.restClient = new RestClient();

        this.styleSheetStorageName = "StyleSheetStorage";
        this.currentStyleSheet = this.getLastSelectedStylesheet();

        // Controllers
        this.listNotesCtr = new ListNotesController(this);
        this.editNoteCtr = new EditNoteController(this);

        this.init();
    }

    init(){
        window.addEventListener("hashchange", this.renderCurrentLocation.bind(this));
        this.setDefaultText();
        this.setPartialRenderers();
        this.renderIndexPage();
        this.showPartialView(LocationEnum.HOME, null);
    }


    //-------------------------------------------------------------------------
    // Routing
    //-------------------------------------------------------------------------

    showPartialView(strLocationEnum, params){
        history.pushState(null, strLocationEnum, strLocationEnum);
        this.renderCurrentLocation(params);
    }

    renderCurrentLocation(params){
        let currentLocationHash = location.hash || "#home";
        // remove event handler of previous page.

        switch(currentLocationHash){
            case LocationEnum.HOME:
                this.renderListNotesView();
                break;
            case LocationEnum.EDIT_NOTE:
                this.renderEditNoteView(params);
                break;
            default:
                console.log("Aktuelle location: '" +currentLocationHash +"' ist unbekannt.");
                break;
        }
    }

    renderIndexPage() {
        this.setStyleSheet(this.getLastSelectedStylesheet());
        this.renderUI();
        this.updateLoginStatus();
        this.setStyleSheetDropdownValue(this.currentStyleSheet);
        this.addEventHandlersForIndexPage();
    }

    renderListNotesView(){
        //Todo: remove handlers from the precious view in a separate method.
        this.listNotesCtr.renderUI(this.model.getNotesView());
    }

    renderEditNoteView(params){
        //Todo: remove handlers from the precious view in a separate method.
        this.editNoteCtr.renderUI(params);
    }

    //-------------------------------------------------------------------------
    // Index Page related functions.
    //-------------------------------------------------------------------------

    getLastSelectedStylesheet(){
        if(this.currentStyleSheet){
            return this.currentStyleSheet;
        } else{
            let staleSheetPath = this.model.loadStylesheet(this.styleSheetStorageName);
            if(staleSheetPath){
                return this.model.loadStylesheet(this.styleSheetStorageName);
            } else {
                return this.relativeRootPath + "stylesheets/default.css";
            }
            return this.model.loadStylesheet(this.styleSheetStorageName);
        }
    }

    setDefaultText() {
        this.headerTextDefault = "Notizen Verwaltung - CAS Projekt 01";
        this.sidebarTextNotesListing =`Erstellen Sie eine neue Notiz mit dem Button "Neue Notiz erstellen".\n
        Ändern Sie eine angezeigte Notiz mit dem Button "Ändern".`;
        this.sidebarTextNotesEditing =`Passen Sie die Angaben nach Ihre Wünschen an und speichern Sie das Dokument mit dem "Speichern" Button.`;
        this.footerTextDefault = "\u00A9 2017 Saidul Hofmann";
    }

    setPartialRenderers() {
        let menu01Template = document.getElementById("menu01-template").innerHTML;
        this.menu01Renderer = Handlebars.compile(menu01Template);

        let menu02Template = document.getElementById("menu02-template").innerHTML;
        this.menu02Renderer = Handlebars.compile(menu02Template);
    }

    renderUI() {
        document.querySelector(".header").innerText = this.headerTextDefault;
        document.querySelector(".menu01").innerHTML = this.menu01Renderer();
        document.querySelector(".menu02").innerHTML = this.menu02Renderer();
        this.setSidebarText(this.sidebarTextNotesListing);
        document.querySelector(".footer").innerText = this.footerTextDefault;
    }


    // -------------------------------------------------------------------------
    // Getters / Setters
    // -------------------------------------------------------------------------

    getStyleSheetLink() { return document.getElementById("lnkDefaultStyleSheet"); }
    setStyleSheet(strStyleSheetName){
        this.getStyleSheetLink().href = strStyleSheetName;
        if(this.getStyleSheetDropdown()) {
            this.setStyleSheetDropdownValue(strStyleSheetName);
        }
    }

    getStyleSheetDropdown() { return document.getElementById('drpSelectStyle'); }
    setStyleSheetDropdownValue(strStyleSheetName) {
        if(strStyleSheetName) { document.getElementById('drpSelectStyle').value = strStyleSheetName; }
    }
    setSelectedStyleSheet() {
        this.setStyleSheet(this.getStyleSheetDropdown().value);
        return this.getStyleSheetDropdown().value;
    }
    setSidebarText(strSidebarText) {
        if(strSidebarText) { document.querySelector(".sidebar").innerText = strSidebarText; }
    }
    getBtnCreateNewNote() { return document.getElementById('btnCreateNewNote'); }
    getBtnLogin() { return document.getElementById('btnLogin'); }
    getBtnLogout() { return document.getElementById('btnLogout'); }


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
    onBtnCreateNewNote_Click(){
        //history.pushState(null, 'edit note', LocationEnum.EDIT_NOTE);
        //this.renderCurrentLocation();
        this.showPartialView(LocationEnum.EDIT_NOTE);
    }
    onDrpSelectStyle_Change(){
        let selectedStyleSheet = this.setSelectedStyleSheet();
        this.model.persistStyleSheet(this.styleSheetStorageName, selectedStyleSheet);
        this.currentStyleSheet = selectedStyleSheet;
    }
    onBtnLogin_Click(){
        this.restClient.login("admin@admin.ch", "123456").then(this.updateLoginStatus.bind(this));
    }
    onBtnLogout_Click(){
        this.restClient.logout().then(this.updateLoginStatus.bind(this));
    }
    updateLoginStatus() {
        let isLoggedIn = this.restClient.isLoggedIn();
        $(".logged-out").toggle(!isLoggedIn);
        $(".logged-in").toggle(isLoggedIn);
    }
}

//-------------------------------------------------------------------------
// Main entry point for the application.
//-------------------------------------------------------------------------

window.onload = function() {

    console.log("window.onload started.");

    const model = new Model();
    //const view = new IndexPage();
    const controller = new IndexController(model);

};
