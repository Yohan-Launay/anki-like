/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'study.show': {
    methods: ["GET","HEAD"]
    pattern: '/study'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/study_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/study_controller').default['show']>>>
    }
  }
  'study.review': {
    methods: ["POST"]
    pattern: '/cards/:id/review'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/card').reviewValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/card').reviewValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/study_controller').default['review']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/study_controller').default['review']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'decks.create': {
    methods: ["GET","HEAD"]
    pattern: '/decks/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['create']>>>
    }
  }
  'decks.example': {
    methods: ["POST"]
    pattern: '/decks/example'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['example']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['example']>>>
    }
  }
  'decks.import': {
    methods: ["POST"]
    pattern: '/decks/import'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/deck').deckImportFileValidator)>|InferInput<(typeof import('#validators/deck').importedDeckValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/deck').deckImportFileValidator)>|InferInput<(typeof import('#validators/deck').importedDeckValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['import']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['import']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'decks.store': {
    methods: ["POST"]
    pattern: '/decks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/deck').deckValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/deck').deckValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'decks.export': {
    methods: ["GET","HEAD"]
    pattern: '/decks/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['export']>>>
    }
  }
  'decks.show': {
    methods: ["GET","HEAD"]
    pattern: '/decks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['show']>>>
    }
  }
  'decks.edit': {
    methods: ["GET","HEAD"]
    pattern: '/decks/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['edit']>>>
    }
  }
  'decks.update': {
    methods: ["POST"]
    pattern: '/decks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/deck').deckValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/deck').deckValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'decks.destroy': {
    methods: ["DELETE"]
    pattern: '/decks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/decks_controller').default['destroy']>>>
    }
  }
  'cards.store': {
    methods: ["POST"]
    pattern: '/decks/:id/cards'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/card').cardValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/card').cardValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cards.edit': {
    methods: ["GET","HEAD"]
    pattern: '/cards/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['edit']>>>
    }
  }
  'cards.update': {
    methods: ["POST"]
    pattern: '/cards/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/card').cardValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/card').cardValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cards.destroy': {
    methods: ["DELETE"]
    pattern: '/cards/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['destroy']>>>
    }
  }
}
