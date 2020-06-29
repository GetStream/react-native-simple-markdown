/* @flow */

import React from 'react'
import { View } from 'react-native'
import concat from 'lodash/concat'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import pullAll from 'lodash/pullAll'
import SimpleMarkdown from 'simple-markdown'

import initialRules from './rules'
import initialStyles from './styles'
import type { DefaultProps, Props } from './types'

const Markdown: React.FC<Props> = ({
  blacklist = [],
  children = '',
  errorHandler = () => null,
  rules = {},
  styles = initialStyles,
  whitelist = [],
}: DefaultProps) => {
  const postProcessRules = (preRules) => {
    const defaultRules = ['paragraph', 'text']
    if (whitelist.length) {
      return pick(preRules, concat(whitelist, defaultRules))
    } if (blacklist.length) {
      return omit(preRules, pullAll(blacklist, defaultRules))
    }
    return preRules
  }

  const renderContent = (child) => {
    try {
      const mergedStyles = { ...initialStyles, ...styles }
      const processedRules = postProcessRules(
        merge(
          {},
          SimpleMarkdown.defaultRules,
          initialRules(mergedStyles),
          rules,
        ),
      )
      const childrenByLine = child.split('\n')
      const tree = childrenByLine.map(
        str => SimpleMarkdown.parserFor(processedRules)(str, {
          inline: false,
        })[0],
      )
      console.log({ tree })
      return SimpleMarkdown.outputFor(processedRules, 'react')(tree)
    }
    catch (errors) {
      errorHandler ? errorHandler(errors, child) : console.error(errors)
    }
    return null
  }

  return (
    <View style={[initialStyles.view, styles.view]}>
      {renderContent(children)}
    </View>
  )
}

export default React.memo(Markdown)
