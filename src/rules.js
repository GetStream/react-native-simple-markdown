/* eslint-disable react/display-name */
/* eslint-disable react/no-array-index-key */
import React from 'react'
import { Image, Linking, Text, View } from 'react-native'

export default styles => ({
  autolink: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.link}>
          {output(node.content, state)}
        </Text>
      )
    },
  },
  blockQuote: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <View
          key={state.key}
          style={[styles.blockQuoteSection, styles.blockQuote]}
        >
          <View
            key={`${state.key}-view`}
            style={[styles.blockQuoteSectionBar, styles.blockQuoteBar]}
          />
          <Text key={`${state.key}-text`} style={styles.blockQuoteText}>
            {output(node.content, state)}
          </Text>
        </View>
      )
    },
  },
  br: {
    react: (node, output, state) => (
      <Text key={state.key} style={styles.br}>
        \n\n
      </Text>
    ),
  },
  codeBlock: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.codeBlock}>
          {null}
        </Text>
      )
    },
  },
  del: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.del}>
          {output(node.content, state)}
        </Text>
      )
    },
  },
  em: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.em}>
          {output(node.content, state)}
        </Text>
      )
    },
  },
  heading: {
    react: (node, output, parentState) => {
      const state = { ...parentState }
      state.withinText = true
      const stylesToApply = [styles.heading, styles[`heading ${node.level}`]]
      state.stylesToApply = stylesToApply
      return (
        <Text key={state.key} style={stylesToApply}>
          {output(node.content, state)}
        </Text>
      )
    },
  },
  hr: {
    react: (node, output, state) => <View key={state.key} style={styles.hr} />,
  },
  image: {
    react: (node, output, state) => (
      <Image
        key={state.key}
        resizeMode={styles.resizeMode || 'contain'}
        source={{ uri: node.target }}
        style={node.target.match(/youtu|vimeo/) ? styles.video : styles.image}
      />
    ),
  },
  inlineCode: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.inlineCode}>
          {node.content}
        </Text>
      )
    },
  },
  link: {
    react: (node, output, state) => {
      state.withinText = true
      const openUrl = (url) => {
        Linking.openURL(url).catch(error =>
          console.warn('An error occurred: ', error),
        )
      }
      return (
        <Text
          key={state.key}
          onPress={() => openUrl(node.target)}
          style={node.target.match(/@/) ? styles.mailTo : styles.link}
        >
          {output(node.content, state)}
        </Text>
      )
    },
  },
  list: {
    react: (node, output, state) => {
      const items = node.items.map((item, i) => {
        let bullet
        if (node.ordered) {
          bullet = (
            <Text key={state.key} style={styles.listItemNumber}>
              {`${i + 1} . `}
            </Text>
          )
        }
        else {
          bullet = (
            <Text key={state.key} style={styles.listItemBullet}>
              {styles.listItemBulletType
                ? `${styles.listItemBulletType} `
                : '\u2022 '}
            </Text>
          )
        }
        const listItemText = (
          <View key={state.key + 1} style={styles.listItemText}>
            {output(item, state)}
          </View>
        )
        return (
          <View key={i} style={styles.listItem}>
            {bullet}
            {listItemText}
          </View>
        )
      })
      return (
        <View key={state.key} style={styles.list}>
          {items}
        </View>
      )
    },
  },
  newline: {
    react: (node, output, state) => (
      <Text key={state.key} style={styles.newline} />
    ),
  },
  paragraph: {
    react: (node, output, state) => (
      <Text key={state.key} style={styles.paragraph}>
        {output(node.content, state)}
      </Text>
    ),
  },
  strong: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.strong}>
          {output(node.content, state)}
        </Text>
      )
    },
  },
  table: {
    react: (node, output, state) => {
      const headers = node.header.map((content, i) => (
        <Text key={i} style={styles.tableHeaderCell}>
          {output(content, state)}
        </Text>
      ))

      const header = <View style={styles.tableHeader}>{headers}</View>

      const rows = node.cells.map((row, r) => {
        const cells = row.map((content, c) => (
          <View key={c} style={styles.tableRowCell}>
            {output(content, state)}
          </View>
        ))
        const rowStyles = [styles.tableRow]
        node.cells.length - 1 === r
          ? rowStyles.push(styles.tableRowLast)
          : null
        return (
          <View key={r} style={rowStyles}>
            {cells}
          </View>
        )
      })

      return (
        <View key={state.key} style={styles.table}>
          {header}
          {rows}
        </View>
      )
    },
  },
  text: {
    react: (node, output, parentState) => {
      const state = { ...parentState }
      const textStyles = [styles.text]
      !state.withinText ? textStyles.push(styles.plainText) : null
      state.stylesToApply ? textStyles.push(state.stylesToApply) : null
      return (
        <Text key={state.key} style={textStyles}>
          {node.content}
        </Text>
      )
    },
  },
  u: {
    react: (node, output, state) => {
      state.withinText = true
      return (
        <Text key={state.key} style={styles.u}>
          {output(node.content, state)}
        </Text>
      )
    },
  },
  url: {
    react: (node, output, state) => {
      state.withinText = true
      const openURL = (url) => {
        Linking.openURL(url).catch(error =>
          console.warn('An error occurred: ', error),
        )
      }
      return (
        <Text
          key={state.key}
          style={styles.url}
          onPress={() => openURL(node.target)}
        >
          {output(node.content, state)}
        </Text>
      )
    },
  },
})
