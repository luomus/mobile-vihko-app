import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import i18n from '../../languages/i18n'
import Cs from '../../styles/ContainerStyles'
import Ts from '../../styles/TextStyles'
import Colors from '../../styles/Colors'
import { getNews } from '../../services/newsService'
import { newsPage } from '../../config/urls'

interface Props {
  tag: string
}

const NewsComponent = (props: Props) => {

  const [latestNews, setLatestNews] = useState<Record<string, any> | undefined>(undefined)

  useEffect(() => {
    const getNewsAsync = async () => {
      const news = await getNews(i18n.language, props.tag)
      if (news.results) {
        setLatestNews(news.results[0])
      } else {
        setLatestNews(undefined)
      }
    }
    getNewsAsync()
  }, [i18n.language])

  if (latestNews) {
    return (
      <View style={{ marginTop: 10, width: '90%' }}>
        <TouchableOpacity onPress={() => Linking.openURL(newsPage + latestNews.id)}
          activeOpacity={0.8} style={[Cs.shadowElement, { shadowColor: Colors.successShadow }]}>
          <View style={Cs.sentEventsContainer}>
            <Text style={[Ts.eventListElementTitle, { color: Colors.successButton1, paddingBottom: 10 }]}>
              {latestNews.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  } else {
    return <></>
  }
}

export default NewsComponent