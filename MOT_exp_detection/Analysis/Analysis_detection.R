library(rjson)
library(tidyverse)

setwd('/Users/young/Desktop/UCSD/Research/MOT_2020/MOT_exp_detection/Data/Raw_data')

all.data_d = list()
subject = 1
for(file.name in list.files(pattern = '*.json')) {
  json_file = fromJSON(file = file.name)
  json_file[['subject']] = subject
  all.data_d[[subject]] = json_file
  subject = subject + 1
}

num.subj = length(all.data_d)
#extract the target selected for 3 conditions from all the participants
dat.accuracy_d = data.frame()
for(i in 1:num.subj) {
  #trial number of each participant is 45.
  for(j in 1:200) {
    dat.accuracy_d = rbind(dat.accuracy_d,
                              tibble(subject = all.data_d[[i]]$subject,
                                     trial_number = all.data_d[[i]]$trials[[j]]$trialNumber,
                                     trial_type = all.data_d[[i]]$trials[[j]]$trialType,
                                     target_index = all.data_d[[i]]$trials[[j]]$rand_crit,
                                     target_selected = list(all.data_d[[i]]$trials[[j]]$selected_targets)))
  }
}

setwd("/Users/young/Desktop/UCSD/Research/MOT_2020/MOT_exp_detection/Data")
save(dat.accuracy_d, file = "detection.Rdata")

#Fix the index difference
dat.accuracy_d$target_index = dat.accuracy_d$target_index + 1

dat.accuracy_d$target_selected = as.numeric(lapply(dat.accuracy_d$target_selected, function(x) which(x == 1)))

correctness = dat.accuracy_d %>% rowwise() %>% summarise(target_index == target_selected)
correctness = correctness$`target_index == target_selected`
dat.accuracy_d$correctness = correctness

#Get the accuracy percentage
summary_accuracy_d = dat.accuracy_d %>% group_by(subject, trial_type) %>% summarise(mean=sum(correctness)/25)

overall_summary_accuracy_d = summary_accuracy_d %>% group_by(trial_type) %>% summarise(mean_overall = mean(mean),
                                                                                   sd_overall = sd(mean),
                                                                                   N=n())

#Group and order the trials
overall_summary_accuracy_d$trial_type_group<- as.factor(c("p", "v180_1", "v990", "v90_3","v90_2","v90_4","v180_2","v90_1"))
overall_summary_accuracy_d$trial_type_group_2<- as.factor(c("p", "v180", "v0", "v90","v90","v90","v180","v90"))
#Plot the accuracy
overall_summary_accuracy_d %>% ggplot(aes(x = as.factor(trial_type_group), y = mean_overall, fill = as.factor(trial_type_group_2), group = 4)) + 
  geom_bar(stat = "identity")+geom_point(size = 2) +
  scale_fill_manual(values = c("red","blue","green4","greenyellow")) +
  labs(x="Trial types", y = "Accuracy", title = "Accuracy for Detection task") +
  geom_errorbar(aes(ymin = mean_overall - sd_overall/sqrt(N), ymax = mean_overall + sd_overall/sqrt(N)),
                width = 0.1) +
  scale_y_continuous(breaks = seq(0, 1, by=0.1), limits=c(0,1))+
  theme_bw() +
  theme(panel.grid = element_blank(),
        axis.ticks.x = element_blank(),
        legend.position = "none",
        axis.text.x = element_blank(),
        axis.title.x = element_blank(),
        axis.text.y = element_text(size = 18, face = "bold"),
        axis.title.y = element_text(size = 18, face = "bold"),
        plot.title = element_blank())
  # geom_hline(yintercept = 0.25,color="darkblue",linetype = "dashed",size=1)

summary_accuracy_d$trial_type_1 <- factor(summary_accuracy_d$trial_type,labels = c("p", "v180", "a", "v90","v90","v90","v180","v90"))
summary_accuracy_d$trial_type_2 <- factor(summary_accuracy_d$trial_type,labels = c("p", "v", "a", "v","v","v","v","v"))

# Hypothesis testing
position = summary_accuracy_d %>% filter(trial_type_2=="p") %>% pull(mean)
t.test(position, mu = 0.25)

velocity = summary_accuracy_d %>% filter(trial_type_2=="v") %>% pull(mean)

acceleration = summary_accuracy_d %>% filter(trial_type_2=="a") %>% pull(mean)
t.test(acceleration, mu = 0.25)

#Aggregate the velocity conditions
summary_accuracy_dv = summary_accuracy_d %>% group_by(subject, trial_type_2) %>% summarise(mean=mean(mean))
velocity_all = summary_accuracy_dv %>% filter(trial_type_2=="v") %>% pull(mean)
t.test(velocity_all, mu = 0.25)

t.test(position, velocity_all, paired = T, var.equal = F)

t.test(velocity_all,acceleration, paired = T, var.equal = F)

#Aggregate the velocity conditions by the change degrees
summary_accuracy_dv2 = summary_accuracy_d %>% group_by(subject, trial_type_1) %>% summarise(mean=mean(mean))
velocity_180 = summary_accuracy_dv2 %>% filter(trial_type_1=="v180") %>% pull(mean)
velocity_90 = summary_accuracy_dv2 %>% filter(trial_type_1=="v90") %>% pull(mean)

t.test(velocity_180, velocity_90, paired = T, var.equal = F)


