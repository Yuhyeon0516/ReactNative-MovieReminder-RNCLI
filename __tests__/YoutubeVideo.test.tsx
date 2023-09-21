import React from 'react';
import YouTubeVideo from '../src/screens/Detail/YouTubeVideo';
import renderer from 'react-test-renderer';
import {Linking, TouchableOpacity} from 'react-native';

describe('<YoutubeVideco />', () => {
    const youTubeKey = 'test_key';
    let testRenderer: renderer.ReactTestRenderer;

    beforeEach(() => {
        testRenderer = renderer.create(
            <YouTubeVideo title="Test Title" youTubeKey={youTubeKey} />,
        );
    });

    it('renders correctly', () => {
        const snapShot = testRenderer.toJSON();
        expect(snapShot).toMatchSnapshot();
    });

    it('open url when it is pressed', () => {
        const spyFn = jest.spyOn(Linking, 'openURL');
        const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);

        touchableOpacity.props.onPress();

        expect(spyFn).toHaveBeenCalledWith(
            `https://www.youtube.com/watch?v=${youTubeKey}`,
        );
    });
});
