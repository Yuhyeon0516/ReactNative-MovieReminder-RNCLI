//
//  CalendarModule.swift
//  MovieReminder
//
//  Created by Yuhyeon Kim on 2023/09/19.
//

import Foundation
import EventKit

@objc(CalendarModule)

class CalendarModule: NSObject {
  var store = EKEventStore()
  @available(iOS 17.0, *)
  @objc func createCalendarEvent(_ timestampInSec: Double, title title: String, resolver resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    store.requestFullAccessToEvents(completion: { granted, error in
      if (error != nil) {
        reject("Permission_error", error?.localizedDescription, error)
        return
      }
      
      if (!granted) {
        reject("Permission_denied", "Permission is denied", nil)
      }
      
      let event:EKEvent = EKEvent(eventStore: self.store)
      event.title = title
      event.startDate = Date(timeIntervalSince1970: timestampInSec)
      event.endDate = Date(timeIntervalSince1970: timestampInSec)
      event.isAllDay = true
      event.calendar = self.store.defaultCalendarForNewEvents
      
      do {
        try self.store.save(event, span: .thisEvent)
        resolve(nil)
      } catch {
        reject("Event_failure", error.localizedDescription, error)
      }
    })
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
  
