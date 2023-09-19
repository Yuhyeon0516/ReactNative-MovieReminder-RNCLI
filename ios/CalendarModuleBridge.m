//
//  CalendarModuleBridge.m
//  MovieReminder
//
//  Created by Yuhyeon Kim on 2023/09/19.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)
RCT_EXTERN_METHOD(createCalendarEvent:(double)timestampInSec
                  title:(NSString *)title
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
@end
