import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'study.show': { paramsTuple?: []; params?: {} }
    'study.review': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.create': { paramsTuple?: []; params?: {} }
    'decks.example': { paramsTuple?: []; params?: {} }
    'decks.import': { paramsTuple?: []; params?: {} }
    'decks.store': { paramsTuple?: []; params?: {} }
    'decks.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'study.show': { paramsTuple?: []; params?: {} }
    'decks.create': { paramsTuple?: []; params?: {} }
    'decks.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'study.show': { paramsTuple?: []; params?: {} }
    'decks.create': { paramsTuple?: []; params?: {} }
    'decks.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'study.review': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'decks.example': { paramsTuple?: []; params?: {} }
    'decks.import': { paramsTuple?: []; params?: {} }
    'decks.store': { paramsTuple?: []; params?: {} }
    'decks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'decks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}