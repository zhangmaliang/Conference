/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView, Image} from 'react-native';
import Button from '../../Component/Button'
import NavigationUtil from '../../Utils/NavigationUtil'
import StorageUtil from '../../Utils/StorageUtil'

let _guideImages = [
    require('../../../Resources/Images/GuideImages/1.png'),
    require('../../../Resources/Images/GuideImages/2.png'),
    require('../../../Resources/Images/GuideImages/3.png'),
    require('../../../Resources/Images/GuideImages/4.png'),
    require('../../../Resources/Images/GuideImages/5.png')
];

export default class GuidePage extends PureComponent {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ScrollView ref="scrollView"
                            style={{flex:1}}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            pagingEnabled={true}
                            bounces={false}
                            onMomentumScrollEnd={s=>this._momentumScrollEnd(s)}
                >
                    {
                        _guideImages.map((image, i) => {
                            return (
                                <Image key={i} source={image} style={styles.imageStyle}>
                                    {i != _guideImages.length - 1 ? null :
                                        <ExperienceBtn callBack={this._beginExperience}/> }
                                </Image>)
                        })
                    }
                </ScrollView>

                <View style={styles.indicatorViewStyle}>
                    {_guideImages.map((_, index) => {
                        let color = this.state.index == index ? 'red' : 'gray';
                        return <Indicator key={index} color={color}/>
                    })}
                </View>
            </View>
        )
    }

    _momentumScrollEnd(s) {
        let offsetX = s.nativeEvent.contentOffset.x;
        let index = Math.floor(offsetX / (SCREEN_WIDTH - 10));
        this.setState({index});
    }

    _beginExperience = () => {
        StorageUtil.save('isGuide', true, ()=>{
            NavigationUtil.reset(this.props.navigation, 'LoginPage')
        });
    }
}

const Indicator = ({color}) => {
    return <Text style={{color:color, fontSize:30}}>&bull;</Text>
};

const ExperienceBtn = ({callBack}) => {
    return (
        <Button
            text="立即体验"
            containerStyle={styles.experienceStyle}
            style={{color:'white'}}
            onPress={()=>callBack()}
        />
    )
};

const styles = StyleSheet.create({
    imageStyle: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        resizeMode: 'contain',
        alignItems: 'center'
    },
    indicatorViewStyle: {
        backgroundColor: 'rgba(0,0,0,0)',
        width: SCREEN_WIDTH,
        height: 50,
        position: 'absolute',
        bottom: 100,
        opacity: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    experienceStyle: {
        width: 100,
        height: 40,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'absolute',
        bottom: 60,
    }
});