import { constants, actions } from './actions';
import { takeLatest } from 'redux-saga';
import { call, put, fork, take, select } from 'redux-saga/effects';

export const getConfig = state => state.config;

export default function* bubblesSaga() {}
